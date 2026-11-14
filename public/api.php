<?php
/**
 * ============================================================================
 * DUC VINH SOLAR - BACKEND DATABASE TRUC TIEP TREN LINUX HOSTING (cPanel/DirectAdmin)
 * ============================================================================
 * Ho tro 2 che do luu tru truc tiep tren Linux Hosting SSD (Khong dung Cloud ngoai):
 * 1. MySQL Database tren Hosting (Khuyen nghi): Dien thong tin MySQL ben duoi.
 *    Bang du lieu se TU DONG DUOC TAO ngay trong lan truy cap dau tien.
 * 2. Luu truc tiep tren o cung NVMe cua Hosting (SQLite / JSON trong thu muc /data):
 *    Neu ban chua dien thong tin MySQL ben duoi, he thong tu dong luu vao thu muc
 *    /data ngay tren Linux Hosting de web hoat dong ngay lap tuc 100%.
 * ============================================================================
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ============================================================================
// CAU HINH MYSQL TREN LINUX HOSTING (Tao trong cPanel -> MySQL Databases)
// ============================================================================
$DB_HOST = 'localhost';
$DB_NAME = ''; // VD: 'ducvinhs_solar' (De trong neu muon luu file truc tiep tren o cung Hosting)
$DB_USER = ''; // VD: 'ducvinhs_admin'
$DB_PASS = ''; // Dien mat khau MySQL cua ban

// Ho tro doc tu file .env.mysql neu co tren cung thu muc public_html
$envFile = __DIR__ . '/.env.mysql.php';
if (file_exists($envFile)) {
    include $envFile;
}

$pdo = null;
$storageMode = 'file';

try {
    if (!empty($DB_NAME) && !empty($DB_USER)) {
        $dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4";
        $pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $storageMode = 'mysql';
        initMysqlTables($pdo);
    } elseif (in_array('sqlite', PDO::getAvailableDrivers())) {
        $dataDir = __DIR__ . '/data';
        if (!is_dir($dataDir)) {
            @mkdir($dataDir, 0755, true);
        }
        $sqlitePath = $dataDir . '/ducvinhsolar.sqlite';
        $pdo = new PDO("sqlite:" . $sqlitePath, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $storageMode = 'sqlite';
        initSqliteTables($pdo);
    }
} catch (Exception $e) {
    // Fallback an toan sang luu JSON truc tiep tren o cung Linux Hosting
    $pdo = null;
    $storageMode = 'file';
}

function initMysqlTables(PDO $pdo) {
    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(120) PRIMARY KEY,
        label VARCHAR(255) NOT NULL,
        short_label VARCHAR(255) NOT NULL,
        `desc` TEXT NOT NULL,
        icon_name VARCHAR(64) NOT NULL,
        sort_order INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS brands (
        id VARCHAR(120) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category_id VARCHAR(120) NOT NULL,
        origin VARCHAR(255) DEFAULT 'Chính hãng',
        sort_order INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(120) PRIMARY KEY,
        sku VARCHAR(120) NOT NULL,
        name VARCHAR(500) NOT NULL,
        category VARCHAR(120) NOT NULL,
        brand VARCHAR(255) NOT NULL,
        short_desc TEXT NOT NULL,
        full_desc LONGTEXT NOT NULL,
        stock INT DEFAULT 0,
        unit VARCHAR(64) DEFAULT 'Tấm',
        featured TINYINT(1) DEFAULT 0,
        image_url LONGTEXT,
        images_json LONGTEXT,
        svg_type VARCHAR(64) DEFAULT 'panel',
        specs_json LONGTEXT,
        highlights_json LONGTEXT,
        applications_json LONGTEXT,
        warranty_years INT DEFAULT 5,
        origin VARCHAR(255) DEFAULT 'Chính hãng',
        status VARCHAR(64) DEFAULT 'in-stock',
        updated_at VARCHAR(64) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(120) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        category VARCHAR(120) NOT NULL,
        capacity VARCHAR(120) NOT NULL,
        location VARCHAR(255) NOT NULL,
        completion_date VARCHAR(120) NOT NULL,
        estimated_saving VARCHAR(255) NOT NULL,
        description LONGTEXT NOT NULL,
        key_equipment_json LONGTEXT,
        image_url LONGTEXT,
        images_json LONGTEXT,
        svg_type VARCHAR(64) DEFAULT 'rooftop'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS blog_posts (
        id VARCHAR(120) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        category VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        published_at VARCHAR(120) NOT NULL,
        read_time VARCHAR(120) NOT NULL,
        summary TEXT NOT NULL,
        content LONGTEXT NOT NULL,
        tags_json LONGTEXT,
        image_url LONGTEXT,
        images_json LONGTEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(120) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(120) NOT NULL,
        address TEXT,
        product_interest TEXT,
        note TEXT,
        created_at VARCHAR(120) NOT NULL,
        status VARCHAR(64) DEFAULT 'new'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS company_settings (
        id VARCHAR(64) PRIMARY KEY,
        legal_name VARCHAR(500) NOT NULL,
        trade_name VARCHAR(255) NOT NULL,
        tax_code VARCHAR(120) NOT NULL,
        tax_address TEXT NOT NULL,
        office_address TEXT NOT NULL,
        warehouse_address TEXT NOT NULL,
        warehouse_map_url TEXT NOT NULL,
        status VARCHAR(120) NOT NULL,
        representative VARCHAR(255) NOT NULL,
        affiliated_units_json LONGTEXT,
        hotline_zalo VARCHAR(120) NOT NULL,
        email VARCHAR(255) NOT NULL,
        working_hours VARCHAR(255) NOT NULL,
        about_text LONGTEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
}

function initSqliteTables(PDO $pdo) {
    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        short_label TEXT NOT NULL,
        desc TEXT NOT NULL,
        icon_name TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0
    );");

    $pdo->exec("CREATE TABLE IF NOT EXISTS brands (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category_id TEXT NOT NULL,
        origin TEXT DEFAULT 'Chính hãng',
        sort_order INTEGER DEFAULT 0
    );");

    $pdo->exec("CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        sku TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        brand TEXT NOT NULL,
        short_desc TEXT NOT NULL,
        full_desc TEXT NOT NULL,
        stock INTEGER DEFAULT 0,
        unit TEXT DEFAULT 'Tấm',
        featured INTEGER DEFAULT 0,
        image_url TEXT,
        images_json TEXT,
        svg_type TEXT DEFAULT 'panel',
        specs_json TEXT,
        highlights_json TEXT,
        applications_json TEXT,
        warranty_years INTEGER DEFAULT 5,
        origin TEXT DEFAULT 'Chính hãng',
        status TEXT DEFAULT 'in-stock',
        updated_at TEXT NOT NULL
    );");

    $pdo->exec("CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        capacity TEXT NOT NULL,
        location TEXT NOT NULL,
        completion_date TEXT NOT NULL,
        estimated_saving TEXT NOT NULL,
        description TEXT NOT NULL,
        key_equipment_json TEXT,
        image_url TEXT,
        images_json TEXT,
        svg_type TEXT DEFAULT 'rooftop'
    );");

    $pdo->exec("CREATE TABLE IF NOT EXISTS blog_posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        author TEXT NOT NULL,
        published_at TEXT NOT NULL,
        read_time TEXT NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        tags_json TEXT,
        image_url TEXT,
        images_json TEXT
    );");

    $pdo->exec("CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT,
        product_interest TEXT,
        note TEXT,
        created_at TEXT NOT NULL,
        status TEXT DEFAULT 'new'
    );");

    $pdo->exec("CREATE TABLE IF NOT EXISTS company_settings (
        id TEXT PRIMARY KEY,
        legal_name TEXT NOT NULL,
        trade_name TEXT NOT NULL,
        tax_code TEXT NOT NULL,
        tax_address TEXT NOT NULL,
        office_address TEXT NOT NULL,
        warehouse_address TEXT NOT NULL,
        warehouse_map_url TEXT NOT NULL,
        status TEXT NOT NULL,
        representative TEXT NOT NULL,
        affiliated_units_json TEXT,
        hotline_zalo TEXT NOT NULL,
        email TEXT NOT NULL,
        working_hours TEXT NOT NULL,
        about_text TEXT NOT NULL
    );");
}

function getJsonFilePath() {
    $dataDir = __DIR__ . '/data';
    if (!is_dir($dataDir)) {
        @mkdir($dataDir, 0755, true);
    }
    return $dataDir . '/ducvinhsolar_db.json';
}

function readFileStore() {
    $file = getJsonFilePath();
    if (!file_exists($file)) {
        return null;
    }
    $raw = @file_get_contents($file);
    $decoded = @json_decode($raw, true);
    return is_array($decoded) ? $decoded : null;
}

function writeFileStore($data) {
    $file = getJsonFilePath();
    @file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

function safeJsonArray($str) {
    if (empty($str)) return [];
    $arr = @json_decode($str, true);
    return is_array($arr) ? $arr : [];
}

function upsertCategoryPDO(PDO $pdo, array $c, string $mode) {
    $sql = $mode === 'mysql'
        ? "INSERT INTO categories (id, label, short_label, `desc`, icon_name) VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE label=VALUES(label), short_label=VALUES(short_label), `desc`=VALUES(`desc`), icon_name=VALUES(icon_name)"
        : "INSERT OR REPLACE INTO categories (id, label, short_label, desc, icon_name) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $c['id'] ?? '',
        $c['label'] ?? '',
        $c['shortLabel'] ?? ($c['label'] ?? ''),
        $c['desc'] ?? '',
        $c['iconName'] ?? 'Package',
    ]);
}

function upsertBrandPDO(PDO $pdo, array $b, string $mode) {
    $sql = $mode === 'mysql'
        ? "INSERT INTO brands (id, name, category_id, origin) VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name), category_id=VALUES(category_id), origin=VALUES(origin)"
        : "INSERT OR REPLACE INTO brands (id, name, category_id, origin) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $b['id'] ?? '',
        $b['name'] ?? '',
        $b['categoryId'] ?? 'solar-panels',
        $b['origin'] ?? 'Chính hãng',
    ]);
}

function upsertProductPDO(PDO $pdo, array $p, string $mode) {
    $imgs = isset($p['images']) && is_array($p['images']) && count($p['images']) > 0
        ? $p['images']
        : (!empty($p['imageUrl']) ? [$p['imageUrl']] : []);
    $sql = $mode === 'mysql'
        ? "INSERT INTO products (id, sku, name, category, brand, short_desc, full_desc, stock, unit, featured, image_url, images_json, svg_type, specs_json, highlights_json, applications_json, warranty_years, origin, status, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE sku=VALUES(sku), name=VALUES(name), category=VALUES(category), brand=VALUES(brand), short_desc=VALUES(short_desc), full_desc=VALUES(full_desc), stock=VALUES(stock), unit=VALUES(unit), featured=VALUES(featured), image_url=VALUES(image_url), images_json=VALUES(images_json), svg_type=VALUES(svg_type), specs_json=VALUES(specs_json), highlights_json=VALUES(highlights_json), applications_json=VALUES(applications_json), warranty_years=VALUES(warranty_years), origin=VALUES(origin), status=VALUES(status), updated_at=VALUES(updated_at)"
        : "INSERT OR REPLACE INTO products (id, sku, name, category, brand, short_desc, full_desc, stock, unit, featured, image_url, images_json, svg_type, specs_json, highlights_json, applications_json, warranty_years, origin, status, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $p['id'] ?? '',
        $p['sku'] ?? '',
        $p['name'] ?? '',
        $p['category'] ?? 'solar-panels',
        $p['brand'] ?? '',
        $p['shortDesc'] ?? '',
        $p['fullDesc'] ?? '',
        (int)($p['stock'] ?? 0),
        $p['unit'] ?? 'Tấm',
        !empty($p['featured']) ? 1 : 0,
        $imgs[0] ?? ($p['imageUrl'] ?? null),
        json_encode($imgs, JSON_UNESCAPED_UNICODE),
        $p['svgType'] ?? 'panel',
        json_encode($p['specs'] ?? [], JSON_UNESCAPED_UNICODE),
        json_encode($p['highlights'] ?? [], JSON_UNESCAPED_UNICODE),
        json_encode($p['applications'] ?? [], JSON_UNESCAPED_UNICODE),
        (int)($p['warrantyYears'] ?? 5),
        $p['origin'] ?? 'Chính hãng',
        $p['status'] ?? 'in-stock',
        $p['updatedAt'] ?? date('Y-m-d'),
    ]);
}

function upsertProjectPDO(PDO $pdo, array $pr, string $mode) {
    $imgs = isset($pr['images']) && is_array($pr['images']) && count($pr['images']) > 0
        ? $pr['images']
        : (!empty($pr['imageUrl']) ? [$pr['imageUrl']] : []);
    $sql = $mode === 'mysql'
        ? "INSERT INTO projects (id, title, category, capacity, location, completion_date, estimated_saving, description, key_equipment_json, image_url, images_json, svg_type)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category), capacity=VALUES(capacity), location=VALUES(location), completion_date=VALUES(completion_date), estimated_saving=VALUES(estimated_saving), description=VALUES(description), key_equipment_json=VALUES(key_equipment_json), image_url=VALUES(image_url), images_json=VALUES(images_json), svg_type=VALUES(svg_type)"
        : "INSERT OR REPLACE INTO projects (id, title, category, capacity, location, completion_date, estimated_saving, description, key_equipment_json, image_url, images_json, svg_type)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $pr['id'] ?? '',
        $pr['title'] ?? '',
        $pr['category'] ?? 'residential',
        $pr['capacity'] ?? '',
        $pr['location'] ?? '',
        $pr['completionDate'] ?? '',
        $pr['estimatedSaving'] ?? '',
        $pr['description'] ?? '',
        json_encode($pr['keyEquipment'] ?? [], JSON_UNESCAPED_UNICODE),
        $imgs[0] ?? ($pr['imageUrl'] ?? null),
        json_encode($imgs, JSON_UNESCAPED_UNICODE),
        $pr['svgType'] ?? 'rooftop',
    ]);
}

function upsertBlogPostPDO(PDO $pdo, array $bp, string $mode) {
    $imgs = isset($bp['images']) && is_array($bp['images']) && count($bp['images']) > 0
        ? $bp['images']
        : (!empty($bp['imageUrl']) ? [$bp['imageUrl']] : []);
    $sql = $mode === 'mysql'
        ? "INSERT INTO blog_posts (id, title, category, author, published_at, read_time, summary, content, tags_json, image_url, images_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category), author=VALUES(author), published_at=VALUES(published_at), read_time=VALUES(read_time), summary=VALUES(summary), content=VALUES(content), tags_json=VALUES(tags_json), image_url=VALUES(image_url), images_json=VALUES(images_json)"
        : "INSERT OR REPLACE INTO blog_posts (id, title, category, author, published_at, read_time, summary, content, tags_json, image_url, images_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $bp['id'] ?? '',
        $bp['title'] ?? '',
        $bp['category'] ?? '',
        $bp['author'] ?? 'Kỹ Sư Đức Vinh Solar',
        $bp['publishedAt'] ?? date('d/m/Y'),
        $bp['readTime'] ?? '5 phút đọc',
        $bp['summary'] ?? '',
        $bp['content'] ?? '',
        json_encode($bp['tags'] ?? [], JSON_UNESCAPED_UNICODE),
        $imgs[0] ?? ($bp['imageUrl'] ?? null),
        json_encode($imgs, JSON_UNESCAPED_UNICODE),
    ]);
}

function upsertInquiryPDO(PDO $pdo, array $inq, string $mode) {
    $sql = $mode === 'mysql'
        ? "INSERT INTO inquiries (id, customer_name, phone, address, product_interest, note, created_at, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE customer_name=VALUES(customer_name), phone=VALUES(phone), address=VALUES(address), product_interest=VALUES(product_interest), note=VALUES(note), created_at=VALUES(created_at), status=VALUES(status)"
        : "INSERT OR REPLACE INTO inquiries (id, customer_name, phone, address, product_interest, note, created_at, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $inq['id'] ?? ('inq-' . time()),
        $inq['customerName'] ?? '',
        $inq['phone'] ?? '',
        $inq['address'] ?? '',
        $inq['productInterest'] ?? '',
        $inq['note'] ?? '',
        $inq['createdAt'] ?? date('d/m/Y H:i'),
        $inq['status'] ?? 'new',
    ]);
}

function upsertCompanyPDO(PDO $pdo, array $info, string $mode) {
    $sql = $mode === 'mysql'
        ? "INSERT INTO company_settings (id, legal_name, trade_name, tax_code, tax_address, office_address, warehouse_address, warehouse_map_url, status, representative, affiliated_units_json, hotline_zalo, email, working_hours, about_text)
           VALUES ('companyInfo', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE legal_name=VALUES(legal_name), trade_name=VALUES(trade_name), tax_code=VALUES(tax_code), tax_address=VALUES(tax_address), office_address=VALUES(office_address), warehouse_address=VALUES(warehouse_address), warehouse_map_url=VALUES(warehouse_map_url), status=VALUES(status), representative=VALUES(representative), affiliated_units_json=VALUES(affiliated_units_json), hotline_zalo=VALUES(hotline_zalo), email=VALUES(email), working_hours=VALUES(working_hours), about_text=VALUES(about_text)"
        : "INSERT OR REPLACE INTO company_settings (id, legal_name, trade_name, tax_code, tax_address, office_address, warehouse_address, warehouse_map_url, status, representative, affiliated_units_json, hotline_zalo, email, working_hours, about_text)
           VALUES ('companyInfo', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $info['legalName'] ?? '',
        $info['tradeName'] ?? 'Đức Vinh Solar',
        $info['taxCode'] ?? '0311193770',
        $info['taxAddress'] ?? '',
        $info['officeAddress'] ?? '',
        $info['warehouseAddress'] ?? '',
        $info['warehouseMapUrl'] ?? '',
        $info['status'] ?? 'Đang hoạt động',
        $info['representative'] ?? 'NGUYỄN QUANG VINH',
        json_encode($info['affiliatedUnits'] ?? [], JSON_UNESCAPED_UNICODE),
        $info['hotlineZalo'] ?? '0938288876',
        $info['email'] ?? 'ducvinhsolar@gmail.com',
        $info['workingHours'] ?? '',
        $info['aboutText'] ?? '',
    ]);
}

// Xac dinh route va HTTP method
$route = isset($_GET['route']) ? trim($_GET['route'], '/') : '';
if (empty($route) && isset($_SERVER['REQUEST_URI'])) {
    $uriPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (preg_match('#/api/(.+)$#', $uriPath, $m)) {
        $route = trim($m[1], '/');
    }
}
$method = $_SERVER['REQUEST_METHOD'];
$rawInput = file_get_contents('php://input');
$body = !empty($rawInput) ? @json_decode($rawInput, true) : [];

// Neu luu bang PDO (MySQL hoac SQLite tren Linux Hosting)
if ($pdo !== null) {
    if ($route === 'state' && $method === 'GET') {
        $catRows = $pdo->query("SELECT * FROM categories")->fetchAll();
        $brandRows = $pdo->query("SELECT * FROM brands")->fetchAll();
        $prodRows = $pdo->query("SELECT * FROM products")->fetchAll();
        $projRows = $pdo->query("SELECT * FROM projects")->fetchAll();
        $blogRows = $pdo->query("SELECT * FROM blog_posts")->fetchAll();
        $inqRows = $pdo->query("SELECT * FROM inquiries")->fetchAll();
        $compRows = $pdo->query("SELECT * FROM company_settings WHERE id = 'companyInfo'")->fetchAll();

        $categories = array_map(fn($r) => [
            'id' => $r['id'],
            'label' => $r['label'],
            'shortLabel' => $r['short_label'],
            'desc' => $r['desc'],
            'iconName' => $r['icon_name'],
        ], $catRows);

        $brands = array_map(fn($r) => [
            'id' => $r['id'],
            'name' => $r['name'],
            'categoryId' => $r['category_id'],
            'origin' => $r['origin'],
        ], $brandRows);

        $products = array_map(function($r) {
            $imgs = safeJsonArray($r['images_json']);
            if (empty($imgs) && !empty($r['image_url'])) $imgs = [$r['image_url']];
            return [
                'id' => $r['id'],
                'sku' => $r['sku'],
                'name' => $r['name'],
                'category' => $r['category'],
                'brand' => $r['brand'],
                'shortDesc' => $r['short_desc'],
                'fullDesc' => $r['full_desc'],
                'stock' => (int)$r['stock'],
                'unit' => $r['unit'],
                'featured' => (bool)$r['featured'],
                'imageUrl' => $r['image_url'] ?: ($imgs[0] ?? null),
                'images' => $imgs,
                'svgType' => $r['svg_type'],
                'specs' => safeJsonArray($r['specs_json']),
                'highlights' => safeJsonArray($r['highlights_json']),
                'applications' => safeJsonArray($r['applications_json']),
                'warrantyYears' => (int)$r['warranty_years'],
                'origin' => $r['origin'],
                'status' => $r['status'],
                'updatedAt' => $r['updated_at'],
            ];
        }, $prodRows);

        $projects = array_map(function($r) {
            $imgs = safeJsonArray($r['images_json']);
            if (empty($imgs) && !empty($r['image_url'])) $imgs = [$r['image_url']];
            return [
                'id' => $r['id'],
                'title' => $r['title'],
                'category' => $r['category'],
                'capacity' => $r['capacity'],
                'location' => $r['location'],
                'completionDate' => $r['completion_date'],
                'estimatedSaving' => $r['estimated_saving'],
                'description' => $r['description'],
                'keyEquipment' => safeJsonArray($r['key_equipment_json']),
                'imageUrl' => $r['image_url'] ?: ($imgs[0] ?? null),
                'images' => $imgs,
                'svgType' => $r['svg_type'],
            ];
        }, $projRows);

        $blogPosts = array_map(function($r) {
            $imgs = safeJsonArray($r['images_json']);
            if (empty($imgs) && !empty($r['image_url'])) $imgs = [$r['image_url']];
            return [
                'id' => $r['id'],
                'title' => $r['title'],
                'category' => $r['category'],
                'author' => $r['author'],
                'publishedAt' => $r['published_at'],
                'readTime' => $r['read_time'],
                'summary' => $r['summary'],
                'content' => $r['content'],
                'tags' => safeJsonArray($r['tags_json']),
                'imageUrl' => $r['image_url'] ?: ($imgs[0] ?? null),
                'images' => $imgs,
            ];
        }, $blogRows);

        $inquiries = array_map(fn($r) => [
            'id' => $r['id'],
            'customerName' => $r['customer_name'],
            'phone' => $r['phone'],
            'address' => $r['address'],
            'productInterest' => $r['product_interest'],
            'note' => $r['note'],
            'createdAt' => $r['created_at'],
            'status' => $r['status'],
        ], $inqRows);

        $companyInfo = null;
        if (!empty($compRows)) {
            $c = $compRows[0];
            $companyInfo = [
                'legalName' => $c['legal_name'],
                'tradeName' => $c['trade_name'],
                'taxCode' => $c['tax_code'],
                'taxAddress' => $c['tax_address'],
                'officeAddress' => $c['office_address'],
                'warehouseAddress' => $c['warehouse_address'],
                'warehouseMapUrl' => $c['warehouse_map_url'],
                'status' => $c['status'],
                'representative' => $c['representative'],
                'affiliatedUnits' => safeJsonArray($c['affiliated_units_json']),
                'hotlineZalo' => $c['hotline_zalo'],
                'email' => $c['email'],
                'workingHours' => $c['working_hours'],
                'aboutText' => $c['about_text'],
            ];
        }

        echo json_encode([
            'storageMode' => $storageMode,
            'seeded' => count($categories) > 0,
            'categories' => $categories,
            'brands' => $brands,
            'products' => $products,
            'projects' => $projects,
            'blogPosts' => $blogPosts,
            'inquiries' => $inquiries,
            'companyInfo' => $companyInfo,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (($route === 'seed' || $route === 'restore') && $method === 'POST') {
        $mode = $body['mode'] ?? 'replace';
        if ($route === 'restore' && $mode === 'replace') {
            $pdo->exec("DELETE FROM categories");
            $pdo->exec("DELETE FROM brands");
            $pdo->exec("DELETE FROM products");
            $pdo->exec("DELETE FROM projects");
            $pdo->exec("DELETE FROM blog_posts");
            $pdo->exec("DELETE FROM inquiries");
        }
        if (!empty($body['categories']) && is_array($body['categories'])) {
            foreach ($body['categories'] as $c) upsertCategoryPDO($pdo, $c, $storageMode);
        }
        if (!empty($body['brands']) && is_array($body['brands'])) {
            foreach ($body['brands'] as $b) upsertBrandPDO($pdo, $b, $storageMode);
        }
        if (!empty($body['products']) && is_array($body['products'])) {
            foreach ($body['products'] as $p) upsertProductPDO($pdo, $p, $storageMode);
        }
        if (!empty($body['projects']) && is_array($body['projects'])) {
            foreach ($body['projects'] as $pr) upsertProjectPDO($pdo, $pr, $storageMode);
        }
        if (!empty($body['blogPosts']) && is_array($body['blogPosts'])) {
            foreach ($body['blogPosts'] as $bp) upsertBlogPostPDO($pdo, $bp, $storageMode);
        }
        if (!empty($body['inquiries']) && is_array($body['inquiries'])) {
            foreach ($body['inquiries'] as $inq) upsertInquiryPDO($pdo, $inq, $storageMode);
        }
        if (!empty($body['companyInfo']) && is_array($body['companyInfo'])) {
            upsertCompanyPDO($pdo, $body['companyInfo'], $storageMode);
        }
        echo json_encode(['ok' => true, 'storageMode' => $storageMode]);
        exit;
    }

    if ($route === 'categories' && $method === 'POST') {
        upsertCategoryPDO($pdo, $body, $storageMode);
        echo json_encode(['ok' => true]);
        exit;
    }
    if (preg_match('#^categories/(.+)$#', $route, $m) && $method === 'DELETE') {
        $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([urldecode($m[1])]);
        echo json_encode(['ok' => true]);
        exit;
    }

    if ($route === 'brands' && $method === 'POST') {
        upsertBrandPDO($pdo, $body, $storageMode);
        echo json_encode(['ok' => true]);
        exit;
    }
    if (preg_match('#^brands/(.+)$#', $route, $m) && $method === 'DELETE') {
        $stmt = $pdo->prepare("DELETE FROM brands WHERE id = ?");
        $stmt->execute([urldecode($m[1])]);
        echo json_encode(['ok' => true]);
        exit;
    }

    if ($route === 'products' && $method === 'POST') {
        upsertProductPDO($pdo, $body, $storageMode);
        echo json_encode(['ok' => true]);
        exit;
    }
    if (preg_match('#^products/(.+)$#', $route, $m) && $method === 'DELETE') {
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([urldecode($m[1])]);
        echo json_encode(['ok' => true]);
        exit;
    }

    if ($route === 'projects' && $method === 'POST') {
        upsertProjectPDO($pdo, $body, $storageMode);
        echo json_encode(['ok' => true]);
        exit;
    }
    if (preg_match('#^projects/(.+)$#', $route, $m) && $method === 'DELETE') {
        $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->execute([urldecode($m[1])]);
        echo json_encode(['ok' => true]);
        exit;
    }

    if ($route === 'blog-posts' && $method === 'POST') {
        upsertBlogPostPDO($pdo, $body, $storageMode);
        echo json_encode(['ok' => true]);
        exit;
    }
    if (preg_match('#^blog-posts/(.+)$#', $route, $m) && $method === 'DELETE') {
        $stmt = $pdo->prepare("DELETE FROM blog_posts WHERE id = ?");
        $stmt->execute([urldecode($m[1])]);
        echo json_encode(['ok' => true]);
        exit;
    }

    if ($route === 'inquiries' && $method === 'POST') {
        upsertInquiryPDO($pdo, $body, $storageMode);
        echo json_encode(['ok' => true]);
        exit;
    }
    if (preg_match('#^inquiries/(.+)$#', $route, $m) && $method === 'DELETE') {
        $stmt = $pdo->prepare("DELETE FROM inquiries WHERE id = ?");
        $stmt->execute([urldecode($m[1])]);
        echo json_encode(['ok' => true]);
        exit;
    }

    if ($route === 'company-info' && $method === 'POST') {
        upsertCompanyPDO($pdo, $body, $storageMode);
        echo json_encode(['ok' => true]);
        exit;
    }
}

// Fallback luu file JSON truc tiep tren o cung NVMe cua Linux Hosting
$store = readFileStore() ?: [
    'categories' => [],
    'brands' => [],
    'products' => [],
    'projects' => [],
    'blogPosts' => [],
    'inquiries' => [],
    'companyInfo' => null,
];

if ($route === 'state' && $method === 'GET') {
    echo json_encode(array_merge(['storageMode' => 'file', 'seeded' => count($store['categories']) > 0], $store), JSON_UNESCAPED_UNICODE);
    exit;
}

if (($route === 'seed' || $route === 'restore') && $method === 'POST') {
    foreach (['categories', 'brands', 'products', 'projects', 'blogPosts', 'inquiries', 'companyInfo'] as $k) {
        if (isset($body[$k])) {
            $store[$k] = $body[$k];
        }
    }
    writeFileStore($store);
    echo json_encode(['ok' => true, 'storageMode' => 'file']);
    exit;
}

$collectionMap = [
    'categories' => 'categories',
    'brands' => 'brands',
    'products' => 'products',
    'projects' => 'projects',
    'blog-posts' => 'blogPosts',
    'inquiries' => 'inquiries',
];

if (isset($collectionMap[$route]) && $method === 'POST') {
    $key = $collectionMap[$route];
    $found = false;
    foreach ($store[$key] as &$item) {
        if (isset($item['id'], $body['id']) && $item['id'] === $body['id']) {
            $item = $body;
            $found = true;
            break;
        }
    }
    if (!$found) {
        $store[$key][] = $body;
    }
    writeFileStore($store);
    echo json_encode(['ok' => true]);
    exit;
}

foreach ($collectionMap as $prefix => $key) {
    if (preg_match('#^' . preg_quote($prefix, '#') . '/(.+)$#', $route, $m) && $method === 'DELETE') {
        $targetId = urldecode($m[1]);
        $store[$key] = array_values(array_filter($store[$key], fn($i) => ($i['id'] ?? '') !== $targetId));
        writeFileStore($store);
        echo json_encode(['ok' => true]);
        exit;
    }
}

if ($route === 'company-info' && $method === 'POST') {
    $store['companyInfo'] = $body;
    writeFileStore($store);
    echo json_encode(['ok' => true]);
    exit;
}

echo json_encode(['ok' => true, 'route' => $route]);
