-- ============================================================================
-- FILE KHOI TAO BANG MYSQL CHO LINUX HOSTING (cPanel -> phpMyAdmin)
-- Luu y: File api.php cung da TU DONG chay cac lenh nay khi ket noi MySQL,
-- ban chi can import file nay trong phpMyAdmin neu muon xem truoc cau truc bang.
-- ============================================================================

CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(120) PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    short_label VARCHAR(255) NOT NULL,
    `desc` TEXT NOT NULL,
    icon_name VARCHAR(64) NOT NULL,
    sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS brands (
    id VARCHAR(120) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id VARCHAR(120) NOT NULL,
    origin VARCHAR(255) DEFAULT 'Chính hãng',
    sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS projects (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS blog_posts (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inquiries (
    id VARCHAR(120) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(120) NOT NULL,
    address TEXT,
    product_interest TEXT,
    note TEXT,
    created_at VARCHAR(120) NOT NULL,
    status VARCHAR(64) DEFAULT 'new'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS company_settings (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
