document.addEventListener('DOMContentLoaded', function () {
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.previousElementSibling;

            // Toggle input type
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });

    const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const identifier = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log("Đăng nhập với:", identifier);
        console.log("Password:", password);

        if (!identifier || !password) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        // Kiểm tra identifier là Email hay PhoneNumber
        const requestBody = identifier.includes('@')
            ? { Email: identifier, Password: password }   // Nếu có '@' => Email
            : { PhoneNumber: identifier, Password: password }; // Không có '@' => PhoneNumber

        console.log("Request body gửi lên server:", JSON.stringify(requestBody));

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody), // Sửa lại body đúng format
            });

            const data = await response.json();

            if (data.error === 0) {
                alert('Đăng nhập thành công! Chào mừng bạn quay trở lại.');
                window.location.href = 'profile.html';
            } else {
                alert(data.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            alert('Lỗi kết nối đến server. Vui lòng thử lại!');
            console.error('Lỗi đăng nhập:', error);
        }
    });
}

    // Register form submission
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Lấy dữ liệu từ form
            const fullname = document.getElementById('fullname').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const agreeTerms = document.getElementById('agree-terms').checked;

            // Kiểm tra dữ liệu nhập
            if (!fullname || !phone || !email || !password || !confirmPassword) {
                alert('Vui lòng nhập đầy đủ thông tin');
                return;
            }

            // Kiểm tra email hợp lệ
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                alert('Email không hợp lệ. Vui lòng nhập đúng định dạng.');
                return;
            }

            // Kiểm tra số điện thoại hợp lệ (Bắt đầu bằng 0, 10-11 số)
            const phoneRegex = /^0\d{9,10}$/;
            if (!phoneRegex.test(phone)) {
                alert('Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.');
                return;
            }

            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp với mật khẩu mới');
                return;
            }

            // Tạo object gửi lên server
            const requestBody = {
                FullName: fullname,
                PhoneNumber: phone,
                Email: email,
                Password: password,
                ConfirmPassword: confirmPassword
            };

            console.log("Request body gửi lên server:", JSON.stringify(requestBody));

            try {
                // Gửi request đến API backend
                const response = await fetch('http://localhost:3000/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    // Nếu server trả về lỗi, kiểm tra mã lỗi
                    const errorData = await response.json();
                    alert(`Lỗi: ${errorData.message || 'Đăng ký thất bại'}`);
                    return;
                }

                const data = await response.json();
                console.log("Phản hồi từ server:", data);

                if (data.error === 0) {
                    alert('Đăng ký thành công! Chào mừng bạn đến với hệ thống.');
                    window.location.href = 'login.html';
                } else {
                    alert(data.message || 'Đăng ký thất bại');
                }
            } catch (error) {
                alert('Lỗi kết nối đến server. Vui lòng thử lại!');
                console.error('Lỗi đăng ký:', error);
            }
        });
    }

    // Password strength checker
    const newPasswordInput = document.getElementById('new-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    if (newPasswordInput && strengthBar && strengthText) {
        newPasswordInput.addEventListener('input', function () {
            const password = this.value;
            let strength = 0;

            // Check password length
            if (password.length >= 8) {
                strength += 1;
            }

            // Check for numbers
            if (/\d/.test(password)) {
                strength += 1;
            }

            // Check for lowercase letters
            if (/[a-z]/.test(password)) {
                strength += 1;
            }

            // Check for uppercase letters
            if (/[A-Z]/.test(password)) {
                strength += 1;
            }

            // Check for special characters
            if (/[^A-Za-z0-9]/.test(password)) {
                strength += 1;
            }

            // Update strength indicator
            switch (strength) {
                case 0:
                case 1:
                    strengthBar.style.width = '20%';
                    strengthBar.style.backgroundColor = '#f44336'; // Red
                    strengthText.innerText = 'Rất yếu';
                    strengthText.style.color = '#f44336';
                    break;
                case 2:
                    strengthBar.style.width = '40%';
                    strengthBar.style.backgroundColor = '#ff9800'; // Orange
                    strengthText.innerText = 'Yếu';
                    strengthText.style.color = '#ff9800';
                    break;
                case 3:
                    strengthBar.style.width = '60%';
                    strengthBar.style.backgroundColor = '#ffc107'; // Amber
                    strengthText.innerText = 'Trung bình';
                    strengthText.style.color = '#ffc107';
                    break;
                case 4:
                    strengthBar.style.width = '80%';
                    strengthBar.style.backgroundColor = '#8bc34a'; // Light green
                    strengthText.innerText = 'Mạnh';
                    strengthText.style.color = '#8bc34a';
                    break;
                case 5:
                    strengthBar.style.width = '100%';
                    strengthBar.style.backgroundColor = '#4caf50'; // Green
                    strengthText.innerText = 'Rất mạnh';
                    strengthText.style.color = '#4caf50';
                    break;
            }
        });
    }

    // Profile edit functionality
    const toggleEditBtn = document.getElementById('toggle-edit');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const profileForm = document.getElementById('profile-form');

    if (toggleEditBtn && profileForm) {
        toggleEditBtn.addEventListener('click', function () {
            // Enable inputs
            const inputs = profileForm.querySelectorAll('input');
            inputs.forEach(input => {
                input.disabled = false;
            });

            // Show form actions
            const formActions = profileForm.querySelector('.form-actions');
            if (formActions) {
                formActions.style.display = 'block';
            }

            // Hide edit button
            this.style.display = 'none';
        });
    }

    if (cancelEditBtn && profileForm) {
        cancelEditBtn.addEventListener('click', function () {
            // Disable inputs
            const inputs = profileForm.querySelectorAll('input');
            inputs.forEach(input => {
                input.disabled = true;
            });

            // Hide form actions
            const formActions = profileForm.querySelector('.form-actions');
            if (formActions) {
                formActions.style.display = 'none';
            }

            // Show edit button
            if (toggleEditBtn) {
                toggleEditBtn.style.display = 'flex';
            }
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simulate update success (would be replaced with actual API call)
            alert('Cập nhật thông tin thành công!');

            // Disable inputs
            const inputs = profileForm.querySelectorAll('input');
            inputs.forEach(input => {
                input.disabled = true;
            });

            // Hide form actions
            const formActions = profileForm.querySelector('.form-actions');
            if (formActions) {
                formActions.style.display = 'none';
            }

            // Show edit button
            if (toggleEditBtn) {
                toggleEditBtn.style.display = 'flex';
            }
        });
    }

    // Change password form submission
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;

            // Validate form
            if (!currentPassword || !newPassword || !confirmNewPassword) {
                alert('Vui lòng nhập đầy đủ thông tin');
                return;
            }

            if (newPassword !== confirmNewPassword) {
                alert('Mật khẩu xác nhận không khớp với mật khẩu mới');
                return;
            }

            // Simulate password change success (would be replaced with actual API call)
            alert('Đổi mật khẩu thành công!');

            // Reset form
            passwordForm.reset();
        });
    }

    // Social connection buttons
    const connectButtons = document.querySelectorAll('.btn-connect');
    const disconnectButtons = document.querySelectorAll('.btn-disconnect');

    connectButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Simulate connection (would be replaced with actual OAuth flow)
            alert('Kết nối tài khoản mạng xã hội thành công!');

            // Change button to "Hủy liên kết"
            const connectionItem = this.closest('.connection-item');
            const connectionInfo = connectionItem.querySelector('.connection-info p');

            connectionInfo.innerText = 'Đã liên kết với example@gmail.com';
            this.innerText = 'Hủy liên kết';
            this.classList.remove('btn-connect');
            this.classList.add('btn-disconnect');
        });
    });

    disconnectButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Confirm disconnection
            if (confirm('Bạn có chắc muốn hủy liên kết tài khoản này?')) {
                // Simulate disconnection (would be replaced with actual API call)
                alert('Đã hủy liên kết tài khoản mạng xã hội!');

                // Change button to "Liên kết"
                const connectionItem = this.closest('.connection-item');
                const connectionInfo = connectionItem.querySelector('.connection-info p');

                connectionInfo.innerText = 'Chưa liên kết';
                this.innerText = 'Liên kết';
                this.classList.remove('btn-disconnect');
                this.classList.add('btn-connect');
            }
        });
    });
});