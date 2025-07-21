import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleActiveUser } from '../redux/userSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import jsPDF from 'jspdf';
import { ProductImage } from '../utils/imageUpload';

function groupOrders(orders, mode) {
  const result = {};
  orders.forEach(o => {
    let key = 'unknown';
    if (o.createdAt) {
      const d = new Date(o.createdAt);
      if (mode === 'day') key = d.toISOString().slice(0, 10);
      else if (mode === 'month') key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      else if (mode === 'quarter') key = d.getFullYear() + '-Q' + (Math.floor(d.getMonth() / 3) + 1);
      else if (mode === 'year') key = d.getFullYear().toString();
    }
    if (!result[key]) result[key] = { revenue: 0, orders: 0 };
    result[key].revenue += o.total || 0;
    result[key].orders += 1;
  });
  return Object.keys(result).sort().map(key => ({ date: key, ...result[key] }));
}

const sectionStyles = {
  marginBottom: '2.5rem',
  padding: '2rem 1.5rem',
  background: '#fff',
  borderRadius: '1rem',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
};

export default function DashboardPage() {
  const products = useSelector(state => state.product.products);
  const orders = useSelector(state => state.order.orders).filter(o => o.status === 'completed' || o.status === 'paid');
  const users = useSelector(state => state.user.users);
  const dispatch = useDispatch();

  // refs cho từng section
  const refOverview = useRef();
  const refChart = useRef();
  const refCustomers = useRef();
  const refStockHistory = useRef();
  const refInventory = useRef();
  const refProfit = useRef();

  // 1. Danh sách khách hàng
  const customers = users.filter(u => u.role === 'customer');

  // 2. Lịch sử nhập/xuất kho
  const stockHistory = [];
  products.forEach(p => {
    if (Array.isArray(p.history)) {
      p.history.forEach(h => {
        stockHistory.push({
          ...h,
          product: p.name,
          category: p.category,
          image: p.image,
        });
      });
    }
  });
  stockHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 3. Dashboard doanh thu, đơn hàng theo thời gian
  const [chartMode, setChartMode] = useState('day');
  const [activeTask, setActiveTask] = useState('Tổng quan');
  const chartData = groupOrders(orders, chartMode);

  // 4. Báo cáo tồn kho
  const inventory = products.map(p => ({
    name: p.name,
    category: p.category,
    stock: p.stock,
    unit: p.unit,
    minStock: p.minStock,
    image: p.image,
  }));

  // 5. Tổng doanh thu, vốn, lãi/lỗ
  let totalRevenue = 0, totalCost = 0, totalProfit = 0;
  const profitTable = products.map(p => {
    let sold = 0;
    orders.forEach(o => {
      if (Array.isArray(o.items)) {
        o.items.forEach(item => {
          if (item.id === p.id) sold += item.quantity;
        });
      }
    });
    const revenue = sold * (p.price || 0);
    const cost = sold * (p.importPrice || 0);
    const profit = revenue - cost;
    totalRevenue += revenue;
    totalCost += cost;
    totalProfit += profit;
    return {
      name: p.name,
      category: p.category,
      sold,
      importPrice: p.importPrice || 0,
      price: p.price || 0,
      revenue,
      cost,
      profit,
      image: p.image,
    };
  });

  // Task list
  const tasks = [
    { label: 'Tổng quan', ref: refOverview, icon: 'bi-bar-chart' },
    { label: 'Biểu đồ doanh thu/đơn hàng', ref: refChart, icon: 'bi-graph-up' },
    { label: 'Quản lý khách hàng', ref: refCustomers, icon: 'bi-people' },
    { label: 'Lịch sử nhập/xuất kho', ref: refStockHistory, icon: 'bi-clock-history' },
    { label: 'Báo cáo tồn kho', ref: refInventory, icon: 'bi-box-seam' },
    { label: 'Báo cáo lãi/lỗ sản phẩm', ref: refProfit, icon: 'bi-cash-stack' },
  ];

  const handleTaskClick = (ref, label) => {
    setActiveTask(label);
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Hàm xuất PDF cho từng section
  const exportSectionToPDF = (sectionName, data, columns, title) => {
    const doc = new jsPDF();
    let yPos = 20;
    
    // Tiêu đề
    doc.setFontSize(18);
    doc.text(title, 20, yPos);
    yPos += 20;
    
    // Thông tin thời gian
    doc.setFontSize(10);
    doc.text(`Xuất báo cáo: ${new Date().toLocaleString('vi-VN')}`, 20, yPos);
    yPos += 15;
    
    // Bảng dữ liệu
    if (data && data.length > 0) {
      const tableData = data.map(item => 
        columns.map(col => {
          if (typeof item[col.key] === 'number') {
            return item[col.key].toLocaleString();
          }
          return item[col.key] || '';
        })
      );
      
      doc.autoTable({
        head: [columns.map(col => col.label)],
        body: tableData,
        startY: yPos,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] }
      });
    } else {
      doc.setFontSize(12);
      doc.text('Không có dữ liệu', 20, yPos + 10);
    }
    
    doc.save(`${sectionName}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Hàm xuất tổng hợp toàn bộ dashboard
  const exportFullDashboard = () => {
    const doc = new jsPDF();
    let yPos = 20;
    
    // Tiêu đề chính
    doc.setFontSize(20);
    doc.text('BÁO CÁO TỔNG HỢP DASHBOARD', 20, yPos);
    yPos += 15;
    
    // Thông tin thời gian
    doc.setFontSize(10);
    doc.text(`Ngày xuất báo cáo: ${new Date().toLocaleString('vi-VN')}`, 20, yPos);
    yPos += 20;
    
    // 1. Tổng quan
    doc.setFontSize(16);
    doc.text('1. TỔNG QUAN DOANH THU', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text(`Tổng doanh thu: ${totalRevenue.toLocaleString()} VNĐ`, 25, yPos);
    yPos += 7;
    doc.text(`Tổng vốn: ${totalCost.toLocaleString()} VNĐ`, 25, yPos);
    yPos += 7;
    doc.text(`Tổng lãi/lỗ: ${totalProfit.toLocaleString()} VNĐ`, 25, yPos);
    yPos += 15;
    
    // 2. Danh sách khách hàng
    doc.setFontSize(16);
    doc.text('2. DANH SÁCH KHÁCH HÀNG', 20, yPos);
    yPos += 10;
    
    if (customers.length > 0) {
      const customerData = customers.map(c => [
        c.email,
        c.role,
        c.isActive === false ? 'Ngưng hoạt động' : 'Hoạt động'
      ]);
      
      doc.autoTable({
        head: [['Email', 'Vai trò', 'Trạng thái']],
        body: customerData,
        startY: yPos,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] }
      });
      yPos = doc.lastAutoTable.finalY + 10;
    } else {
      doc.setFontSize(10);
      doc.text('Không có dữ liệu khách hàng', 25, yPos);
      yPos += 10;
    }
    
    // 3. Lịch sử nhập/xuất kho
    doc.setFontSize(16);
    doc.text('3. LỊCH SỬ NHẬP/XUẤT KHO', 20, yPos);
    yPos += 10;
    
    if (stockHistory.length > 0) {
      const stockData = stockHistory.slice(0, 20).map(h => [
        h.date ? h.date.slice(0, 19).replace('T', ' ') : '',
        h.product,
        h.category,
        h.type === 'import' ? 'Nhập kho' : h.type === 'export' ? 'Xuất kho' : 'Điều chỉnh',
        h.quantity,
        h.note
      ]);
      
      doc.autoTable({
        head: [['Ngày', 'Sản phẩm', 'Danh mục', 'Loại', 'Số lượng', 'Ghi chú']],
        body: stockData,
        startY: yPos,
        styles: { fontSize: 7 },
        headStyles: { fillColor: [66, 139, 202] }
      });
      yPos = doc.lastAutoTable.finalY + 10;
    } else {
      doc.setFontSize(10);
      doc.text('Không có dữ liệu lịch sử kho', 25, yPos);
      yPos += 10;
    }
    
    // 4. Báo cáo tồn kho
    doc.setFontSize(16);
    doc.text('4. BÁO CÁO TỒN KHO', 20, yPos);
    yPos += 10;
    
    if (inventory.length > 0) {
      const inventoryData = inventory.map(p => [
        p.name,
        p.category,
        p.stock,
        p.unit,
        p.minStock,
        p.stock < p.minStock ? 'CẢNH BÁO' : 'Bình thường'
      ]);
      
      doc.autoTable({
        head: [['Tên', 'Danh mục', 'Tồn kho', 'ĐVT', 'Ngưỡng cảnh báo', 'Trạng thái']],
        body: inventoryData,
        startY: yPos,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] }
      });
      yPos = doc.lastAutoTable.finalY + 10;
    } else {
      doc.setFontSize(10);
      doc.text('Không có dữ liệu tồn kho', 25, yPos);
      yPos += 10;
    }
    
    // 5. Báo cáo lãi/lỗ sản phẩm
    doc.setFontSize(16);
    doc.text('5. BÁO CÁO LÃI/LỖ SẢN PHẨM', 20, yPos);
    yPos += 10;
    
    if (profitTable.length > 0) {
      const profitData = profitTable.map(p => [
        p.name,
        p.category,
        p.sold,
        p.importPrice.toLocaleString(),
        p.price.toLocaleString(),
        p.revenue.toLocaleString(),
        p.cost.toLocaleString(),
        p.profit.toLocaleString()
      ]);
      
      doc.autoTable({
        head: [['Tên', 'Danh mục', 'Đã bán', 'Giá nhập', 'Giá bán', 'Doanh thu', 'Vốn', 'Lãi/Lỗ']],
        body: profitData,
        startY: yPos,
        styles: { fontSize: 7 },
        headStyles: { fillColor: [66, 139, 202] }
      });
    } else {
      doc.setFontSize(10);
      doc.text('Không có dữ liệu lãi/lỗ', 25, yPos);
    }
    
    doc.save(`Dashboard_TongHop_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="container-fluid mt-4" style={{ background: '#f6f8fa', minHeight: '100vh' }}>
      <div className="row">
        {/* Sidebar task list */}
        <div className="col-lg-2 mb-3 d-none d-lg-block">
          <div className="list-group sticky-top" style={{ borderRadius: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            {tasks.map(task => (
              <button key={task.label} className={`list-group-item list-group-item-action py-3 fw-semibold ${activeTask === task.label ? 'active border-primary' : ''}`} style={{ borderRadius: '0.75rem', margin: '0.25rem 0', fontSize: '1.05rem' }} onClick={() => handleTaskClick(task.ref, task.label)}>
                <i className={`bi ${task.icon} me-2`}></i>{task.label}
              </button>
            ))}
          </div>
        </div>
        {/* Main content */}
        <div className="col-lg-10">
          {/* Task list on mobile */}
          <div className="d-lg-none mb-3">
            <div className="d-flex flex-nowrap gap-2 justify-content-center overflow-auto pb-2" style={{ whiteSpace: 'nowrap' }}>
              {tasks.map(task => (
                <button key={task.label} className={`btn btn-outline-primary btn-sm px-3 py-2 ${activeTask === task.label ? 'active border-primary' : ''}`} style={{ borderRadius: '0.75rem', fontWeight: 600 }} onClick={() => handleTaskClick(task.ref, task.label)}>
                  <i className={`bi ${task.icon} me-1`}></i>{task.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nút xuất tổng hợp */}
          <div className="mb-3">
            <button 
              className="btn btn-success btn-lg shadow-sm" 
              onClick={exportFullDashboard}
              style={{ borderRadius: '0.75rem' }}
            >
              <i className="bi bi-file-earmark-pdf me-2"></i>
              Xuất báo cáo tổng hợp PDF
            </button>
          </div>

          {/* Tổng quan */}
          <div ref={refOverview} />
          <div style={sectionStyles} className="mb-4">
            <h2 className="mb-4 fw-bold"><i className="bi bi-bar-chart me-2 text-primary"></i>Dashboard Quản trị</h2>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card text-bg-success mb-3 shadow-lg border-0" style={{ borderRadius: '1rem', minHeight: 120 }}>
                  <div className="card-body d-flex align-items-center">
                    <i className="bi bi-currency-dollar display-5 me-3"></i>
                    <div>
                      <h5 className="card-title">Tổng doanh thu</h5>
                      <p className="card-text fs-4 fw-bold mb-0">{totalRevenue.toLocaleString()} VNĐ</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-bg-info mb-3 shadow-lg border-0" style={{ borderRadius: '1rem', minHeight: 120 }}>
                  <div className="card-body d-flex align-items-center">
                    <i className="bi bi-wallet2 display-5 me-3"></i>
                    <div>
                      <h5 className="card-title">Tổng vốn</h5>
                      <p className="card-text fs-4 fw-bold mb-0">{totalCost.toLocaleString()} VNĐ</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className={`card mb-3 shadow-lg border-0 ${totalProfit >= 0 ? 'text-bg-primary' : 'text-bg-danger'}`} style={{ borderRadius: '1rem', minHeight: 120 }}>
                  <div className="card-body d-flex align-items-center">
                    <i className="bi bi-graph-up-arrow display-5 me-3"></i>
                    <div>
                      <h5 className="card-title">Tổng lãi/lỗ</h5>
                      <p className="card-text fs-4 fw-bold mb-0">{totalProfit.toLocaleString()} VNĐ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chọn chế độ xem biểu đồ */}
          <div ref={refChart} />
          <div style={sectionStyles} className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-graph-up text-primary fs-3 me-2"></i>
              <h4 className="mb-0 fw-bold">Biểu đồ doanh thu & đơn hàng</h4>
            </div>
            <div className="row mb-2">
              <div className="col-md-6">
                <label className="me-2">Chế độ xem biểu đồ:</label>
                <select value={chartMode} onChange={e => setChartMode(e.target.value)} className="form-select d-inline-block w-auto">
                  <option value="day">Ngày</option>
                  <option value="month">Tháng</option>
                  <option value="quarter">Quý</option>
                  <option value="year">Năm</option>
                </select>
              </div>
            </div>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card shadow-sm border-0" style={{ borderRadius: '1rem', padding: '1rem' }}>
                  <h6 className="fw-bold mb-2">Doanh thu theo {chartMode === 'day' ? 'ngày' : chartMode === 'month' ? 'tháng' : chartMode === 'quarter' ? 'quý' : 'năm'}</h6>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Doanh thu" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card shadow-sm border-0" style={{ borderRadius: '1rem', padding: '1rem' }}>
                  <h6 className="fw-bold mb-2">Số lượng đơn hàng theo {chartMode === 'day' ? 'ngày' : chartMode === 'month' ? 'tháng' : chartMode === 'quarter' ? 'quý' : 'năm'}</h6>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="orders" fill="#82ca9d" name="Số đơn hàng" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Quản lý khách hàng */}
          <div ref={refCustomers} />
          <div style={sectionStyles} className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-people text-primary fs-3 me-2"></i>
                <h4 className="mb-0 fw-bold">Quản lý danh sách khách hàng</h4>
              </div>
              <button 
                className="btn btn-outline-primary btn-sm" 
                onClick={() => exportSectionToPDF(
                  'KhachHang',
                  customers,
                  [
                    { key: 'email', label: 'Email' },
                    { key: 'role', label: 'Vai trò' },
                    { key: 'isActive', label: 'Trạng thái' }
                  ],
                  'DANH SÁCH KHÁCH HÀNG'
                )}
              >
                <i className="bi bi-file-earmark-pdf me-1"></i>Xuất PDF
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(u => (
                    <tr key={u.email} style={{ opacity: u.isActive === false ? 0.5 : 1 }}>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.isActive === false ? <span className="badge bg-danger">Đã ngưng hoạt động</span> : <span className="badge bg-success">Hoạt động</span>}</td>
                      <td>
                        <button className={`btn btn-${u.isActive === false ? 'success' : 'danger'} btn-sm`} onClick={() => dispatch(toggleActiveUser(u.email))}>
                          {u.isActive === false ? 'Kích hoạt' : 'Ngưng hoạt động'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lịch sử nhập/xuất kho */}
          <div ref={refStockHistory} />
          <div style={sectionStyles} className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-clock-history text-primary fs-3 me-2"></i>
                <h4 className="mb-0 fw-bold">Lịch sử nhập/xuất kho</h4>
              </div>
              <button 
                className="btn btn-outline-primary btn-sm" 
                onClick={() => exportSectionToPDF(
                  'LichSuKho',
                  stockHistory,
                  [
                    { key: 'date', label: 'Ngày' },
                    { key: 'product', label: 'Sản phẩm' },
                    { key: 'category', label: 'Danh mục' },
                    { key: 'type', label: 'Loại' },
                    { key: 'quantity', label: 'Số lượng' },
                    { key: 'note', label: 'Ghi chú' }
                  ],
                  'LỊCH SỬ NHẬP/XUẤT KHO'
                )}
              >
                <i className="bi bi-file-earmark-pdf me-1"></i>Xuất PDF
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle table-sm">
                <thead className="table-light">
                  <tr>
                    <th>Ngày</th>
                    <th>Ảnh</th>
                    <th>Sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Loại</th>
                    <th>Số lượng</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {stockHistory.slice(0, 30).map((h, idx) => (
                    <tr key={idx}>
                      <td>{h.date ? h.date.slice(0, 19).replace('T', ' ') : ''}</td>
                      <td>
                        <ProductImage 
                          image={h.image} 
                          name={h.product}
                          style={{ width: 40, height: 40 }}
                        />
                      </td>
                      <td>{h.product}</td>
                      <td>{h.category}</td>
                      <td>{h.type === 'import' ? 'Nhập kho' : h.type === 'export' ? 'Xuất kho' : 'Điều chỉnh'}</td>
                      <td>{h.quantity}</td>
                      <td>{h.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Báo cáo tồn kho */}
          <div ref={refInventory} />
          <div style={sectionStyles} className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-box-seam text-primary fs-3 me-2"></i>
                <h4 className="mb-0 fw-bold">Báo cáo tồn kho</h4>
              </div>
              <button 
                className="btn btn-outline-primary btn-sm" 
                onClick={() => exportSectionToPDF(
                  'TonKho',
                  inventory,
                  [
                    { key: 'name', label: 'Tên' },
                    { key: 'category', label: 'Danh mục' },
                    { key: 'stock', label: 'Tồn kho' },
                    { key: 'unit', label: 'ĐVT' },
                    { key: 'minStock', label: 'Ngưỡng cảnh báo' }
                  ],
                  'BÁO CÁO TỒN KHO'
                )}
              >
                <i className="bi bi-file-earmark-pdf me-1"></i>Xuất PDF
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle table-sm">
                <thead className="table-light">
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên</th>
                    <th>Danh mục</th>
                    <th>Tồn kho</th>
                    <th>ĐVT</th>
                    <th>Ngưỡng cảnh báo</th>
                    <th>Chú ý</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((p, idx) => (
                    <tr key={idx} style={{ color: p.stock < p.minStock ? 'red' : undefined }}>
                      <td>
                        <ProductImage 
                          image={p.image} 
                          name={p.name}
                          style={{ width: 40, height: 40 }}
                        />
                      </td>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>{p.stock}</td>
                      <td>{p.unit}</td>
                      <td>{p.minStock}</td>
                      <td>{p.stock < p.minStock ? <span className="badge bg-danger"><i className="bi bi-exclamation-triangle me-1"></i>Chú ý: Sắp hết hàng!</span> : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bảng lãi/lỗ sản phẩm */}
          <div ref={refProfit} />
          <div style={sectionStyles} className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-cash-stack text-primary fs-3 me-2"></i>
                <h4 className="mb-0 fw-bold">Báo cáo vốn, doanh thu, lãi/lỗ từng sản phẩm</h4>
              </div>
              <button 
                className="btn btn-outline-primary btn-sm" 
                onClick={() => exportSectionToPDF(
                  'LaiLo',
                  profitTable,
                  [
                    { key: 'name', label: 'Tên' },
                    { key: 'category', label: 'Danh mục' },
                    { key: 'sold', label: 'Đã bán' },
                    { key: 'importPrice', label: 'Giá nhập' },
                    { key: 'price', label: 'Giá bán' },
                    { key: 'revenue', label: 'Doanh thu' },
                    { key: 'cost', label: 'Vốn' },
                    { key: 'profit', label: 'Lãi/Lỗ' }
                  ],
                  'BÁO CÁO LÃI/LỖ SẢN PHẨM'
                )}
              >
                <i className="bi bi-file-earmark-pdf me-1"></i>Xuất PDF
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle table-sm">
                <thead className="table-light">
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên</th>
                    <th>Danh mục</th>
                    <th>Đã bán</th>
                    <th>Giá nhập</th>
                    <th>Giá bán</th>
                    <th>Doanh thu</th>
                    <th>Vốn</th>
                    <th>Lãi/Lỗ</th>
                  </tr>
                </thead>
                <tbody>
                  {profitTable.map((p, idx) => (
                    <tr key={idx} style={{ color: p.profit < 0 ? 'red' : undefined }}>
                      <td>
                        <ProductImage 
                          image={p.image} 
                          name={p.name}
                          style={{ width: 40, height: 40 }}
                        />
                      </td>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>{p.sold}</td>
                      <td>{p.importPrice.toLocaleString()}</td>
                      <td>{p.price.toLocaleString()}</td>
                      <td>{p.revenue.toLocaleString()}</td>
                      <td>{p.cost.toLocaleString()}</td>
                      <td>{p.profit.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

