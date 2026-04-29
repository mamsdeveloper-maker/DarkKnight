-- AX 업무자동화 플랫폼 DB 스키마
-- Supabase SQL Editor에서 실행하세요

-- 지점 테이블
CREATE TABLE IF NOT EXISTS branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  region TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 브랜드 테이블
CREATE TABLE IF NOT EXISTS brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 상품 테이블
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  image_url TEXT,
  unit_price NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 파일 업로드 이력
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  file_name TEXT NOT NULL,
  file_path TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','success','error')),
  row_count INTEGER DEFAULT 0,
  error_log TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 재고 스냅샷
CREATE TABLE IF NOT EXISTS inventory_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID REFERENCES file_uploads(id),
  branch_id UUID REFERENCES branches(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 0,
  max_quantity INTEGER DEFAULT 0,
  snapshot_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 판매 기록
CREATE TABLE IF NOT EXISTS sales_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID REFERENCES file_uploads(id),
  branch_id UUID REFERENCES branches(id),
  product_id UUID REFERENCES products(id),
  quantity_sold INTEGER DEFAULT 0,
  revenue NUMERIC(14,2) DEFAULT 0,
  sale_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 사용자 프로필 (Supabase Auth 연동)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin','manager','viewer')),
  branch_id UUID REFERENCES branches(id),
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_inventory_branch ON inventory_snapshots(branch_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_snapshots(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_date ON inventory_snapshots(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_sales_branch ON sales_records(branch_id);
CREATE INDEX IF NOT EXISTS idx_sales_product ON sales_records(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales_records(sale_date);

-- RLS (Row Level Security) 활성화
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 인증된 사용자 읽기 허용
CREATE POLICY "Authenticated users can read branches" ON branches FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read brands" ON brands FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read products" ON products FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read inventory" ON inventory_snapshots FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read sales" ON sales_records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can read own uploads" ON file_uploads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own uploads" ON file_uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role full access" ON inventory_snapshots FOR ALL USING (true);
CREATE POLICY "Service role full access sales" ON sales_records FOR ALL USING (true);

-- 샘플 데이터 (개발용)
INSERT INTO branches (name, region) VALUES
  ('강남점', '서울'),
  ('홍대점', '서울'),
  ('부산점', '부산'),
  ('대구점', '대구'),
  ('인천점', '인천')
ON CONFLICT (name) DO NOTHING;

INSERT INTO brands (name, category) VALUES
  ('Nike', '스포츠'),
  ('Adidas', '스포츠'),
  ('Zara', '패션'),
  ('H&M', '패션'),
  ('Uniqlo', '캐주얼')
ON CONFLICT (name) DO NOTHING;
