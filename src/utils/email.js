import emailjs from '@emailjs/browser';

// Gửi cho admin khi có đơn hàng thanh toán
export function sendAdminOrderEmail({ order_id, email, total }) {
  console.log('sendAdminOrderEmail:', { order_id, email, total });
  return emailjs.send(
    'service_ktib3uo',
    'template_admin_order',
    { order_id, email, total },
    '-QbaOCwU_OeFFlwlo'
  ).then(
    (response) => { console.log('SUCCESS! sendAdminOrderEmail', response.status, response.text); },
    (err) => { console.log('FAILED... sendAdminOrderEmail', err); }
  );
}

// Gửi cho admin khi có người trả nợ
export function sendAdminDebtEmail({ debt_id, email, amount }) {
  console.log('sendAdminDebtEmail:', { debt_id, email, amount });
  return emailjs.send(
    'service_ktib3uo',
    'template_admin_debt', // Template ID cho admin trả nợ
    { debt_id, email, amount },
    '-QbaOCwU_OeFFlwlo'
  ).then(
    (response) => { console.log('SUCCESS! sendAdminDebtEmail', response.status, response.text); },
    (err) => { console.log('FAILED... sendAdminDebtEmail', err); }
  );
}

// Gửi cho admin khi cảnh báo tồn kho
export function sendAdminLowStockEmail({ product_name, stock }) {
  console.log('sendAdminLowStockEmail:', { product_name, stock });
  return emailjs.send(
    'service_ktib3uo',
    'template_admin_lowstock', // Template ID cho admin cảnh báo tồn kho
    { product_name, stock },
    '-QbaOCwU_OeFFlwlo'
  ).then(
    (response) => { console.log('SUCCESS! sendAdminLowStockEmail', response.status, response.text); },
    (err) => { console.log('FAILED... sendAdminLowStockEmail', err); }
  );
}

// Gửi cho user khi đặt ký thành công
export function sendUserDepositSuccessEmail({ email, deposit_id, amount }) {
  console.log('sendUserDepositSuccessEmail:', { email, deposit_id, amount });
  return emailjs.send(
    'service_ktib3uo',
    'template_fszro08', // Template ID cho user đặt ký
    { email, deposit_id, amount },
    '-QbaOCwU_OeFFlwlo'
  ).then(
    (response) => { console.log('SUCCESS! sendUserDepositSuccessEmail', response.status, response.text); },
    (err) => { console.log('FAILED... sendUserDepositSuccessEmail', err); }
  );
}

// Gửi cho user khi đặt hàng thành công
export function sendUserOrderSuccessEmail({ email, order_id, total }) {
  console.log('Gửi mail với:', { email, order_id, total });
  return emailjs.send(
    'service_ktib3uo',
    'template_jozj62r', // Template ID cho user đặt hàng (bạn đã có)
    { email, order_id, total },
    '-QbaOCwU_OeFFlwlo'
  ).then(
    (response) => { console.log('SUCCESS! sendUserOrderSuccessEmail', response.status, response.text); },
    (err) => { console.log('FAILED... sendUserOrderSuccessEmail', err); }
  );
}

// Gửi cho user khi trả nợ thành công
export function sendUserDebtPaidEmail({ email, debt_id, amount }) {
  console.log('sendUserDebtPaidEmail:', { email, debt_id, amount });
  return emailjs.send(
    'service_ktib3uo',
    'template_user_debt', // Template ID cho user trả nợ
    { email, debt_id, amount },
    '-QbaOCwU_OeFFlwlo'
  ).then(
    (response) => { console.log('SUCCESS! sendUserDebtPaidEmail', response.status, response.text); },
    (err) => { console.log('FAILED... sendUserDebtPaidEmail', err); }
  );
}

// Gửi cho user khi đăng ký tài khoản thành công
export function sendUserRegisterEmail({ email, user_name }) {
  console.log('sendUserRegisterEmail:', { email, user_name });
  return emailjs.send(
    'service_ktib3uo',
    'template_mw6i9rg', // Template ID cho xác nhận đăng ký
    { email, user_name },
    '-QbaOCwU_OeFFlwlo'
  ).then(
    (response) => { console.log('SUCCESS! sendUserRegisterEmail', response.status, response.text); },
    (err) => { console.log('FAILED... sendUserRegisterEmail', err); }
  );
}