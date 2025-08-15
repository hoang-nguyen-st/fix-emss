import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailNewUserDto } from './dto/send-email-user.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendActivationEmail(sendEmailNewUserDto: SendEmailNewUserDto): Promise<void> {
    const { name, email, password, token } = sendEmailNewUserDto;
    const feAppUrl = this.configService.get('FE_APP_URL');
    const activationLink = `${feAppUrl}/sign-in?activateToken=${token}`;
    const template = this.generateEmailActivateTemplate(name, email, password, activationLink);
    await this.sendEmail(email, 'Kích hoạt tài khoản EMS', template);
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to,
        subject,
        html,
      });
    } catch (error) {
      throw new Error('Failed to send email');
    }
  }

  /**
   * Generate the activation email template in English, matching the provided screenshot.
   * @param userName - The user's name
   * @param email - The user's email address
   * @param password - The user's temporary password
   * @param activationLink - The link to the login page
   * @returns HTML string for the email
   */
  private generateEmailActivateTemplate(
    userName: string,
    email: string,
    password: string,
    activationLink: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Welcome to EMS</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 650px;
              margin: 30px auto;
              background-color: #ffffff;
              border-radius: 10px;
            }
            .header {
              background-color: #2563eb;
              color: white;
              text-align: center;
              font-size: 25px;
              font-weight: bold;
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
              padding: 20px 0px;
            }
            .subtitle {
              color: white;
              text-align: center;
              font-size: 14px !important;
              font-weight: 400 !important;
            }
            .content {
              padding: 0 32px;
              color: #000000;
              font-size: 15px;
            }
            .info-box {
              background-color: #f9f9f9;
              border: 1px solid #d1d1d1;
              padding: 12px 18px;
              margin: 20px 0;
              font-size: 15px;
              border-radius: 6px;
            }
            .note {
              font-size: 13px;
              color: #888;
              margin-bottom: 20px;
              font-style: italic;
            }
            .btn {
              display: block;
              width: 160px;
              margin: 0 auto 24px auto;
              background-color: #4285f4;
              color: #fff !important;
              text-align: center;
              padding: 10px 0;
              font-weight: bold;
              text-decoration: none;
              border-radius: 5px;
              font-size: 15px;
            }
            .instructions {
              font-size: 15px;
              margin-top: 10px;
            }
            .instructions ol {
              padding-left: 20px;
            }
            .instructions li {
              margin-bottom: 8px;
            }
            .support {
              font-size: 14px;
              margin-top: 20px;
              line-height: 1.6;
            }
            .footer {
              margin-top: 24px;
              padding: 18px 32px;
              font-size: 14px;
              color: #555;
              border-top: 1px solid #e0e0e0;
              text-align: left;
            }
            .footer .company {
              font-weight: bold;
              color: #4285f4;
              line-height: 1.4;
            }
            .footer .website {
              margin-top: 2px;
              color: #4285f4;
              text-decoration: underline;
            }
            .devplus {
              color: #000 !important;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div>Chào mừng tới hệ thống quản lý năng lượng</div>
              <div class="subtitle">Hệ thống quản lý năng lượng</div>
            </div>
            <div class="content">
              <p>Xin chào <b>${userName}</b>,</p>
              <p>
                Cảm ơn bạn đã tham gia sử dụng hệ thống quản lý năng lượng (EMS). Tài khoản của bạn đã được tạo thành công. Dưới đây là thông tin đăng nhập:
              </p>

              <div class="info-box">
                <div>• <b>Tên đăng nhập:</b> ${email}</div>
                <div>• <b>Mật khẩu tạm thời:</b> ${password}</div>
              </div>

              <div class="note">(Lưu ý: Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu để đảm bảo an toàn.)</div>

              <a href="${activationLink}" class="btn">Kích hoạt ngay</a>

              <div class="instructions">
                <b>Hướng dẫn:</b>
                <ol>
                  <li>Truy cập <a href="${activationLink}">EMS Link</a> để đăng nhập.</li>
                  <li>Sử dụng thông tin đăng nhập ở trên để truy cập tài khoản.</li>
                  <li>Đổi mật khẩu ngay sau khi đăng nhập lần đầu.</li>
                </ol>
              </div>

              <div class="support">
                Nếu bạn gặp bất kỳ vấn đề nào hoặc cần hỗ trợ, vui lòng liên hệ đội ngũ hỗ trợ của chúng tôi:<br />
                <b>Email:</b> support@ems.example.com<br />
                <b>Hotline:</b> +84 123 456 789
              </div>

              <div style="margin-top: 20px">Chúng tôi rất mong được đồng hành cùng bạn trong việc quản lý năng lượng hiệu quả!</div>
            </div>

            <div class="footer">
              <div>Trân trọng,</div>
              <div class="company">
                Đội ngũ EMS<br />
                <div class="devplus">DevPlus</div>
              </div>
              <div class="website">devplus.vn</div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
