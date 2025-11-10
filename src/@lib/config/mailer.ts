import { Env } from '.environments';
import { IBaseResponse } from '@base/interfaces';
import { ENUM_SETTINGS_EMAIL_PROVIDER_TYPES, TSettingsEmailProviderType } from '@modules/settings/lib/enums';
import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';

const compileTemplateFn = (templateName: string, data: Record<string, any>): string => {
  const templatePath = path.join(process.cwd(), 'email-templates', `${templateName}.hbs`);
  const source = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(source);

  return template(data);
};

const buildTransporterFn = ({
  provider,
  host,
  port,
  username,
  pass,
  secure,
  apiKey,
  region,
}: {
  provider: TSettingsEmailProviderType;
  host?: string;
  port?: number;
  username?: string;
  pass?: string;
  secure?: boolean;
  apiKey?: string;
  region?: string;
}): Transporter => {
  switch (provider) {
    case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.GMAIL:
      return nodemailer.createTransport({
        service: 'gmail',
        auth: { user: username, pass },
      });

    case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.AWS_SES:
      return nodemailer.createTransport({
        host: `email-smtp.${region}.amazonaws.com`,
        port: 465,
        secure: true,
        auth: { user: username, pass },
      });

    case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.SENDGRID:
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: { user: 'apikey', pass: apiKey },
      });

    case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.MAILGUN:
      return nodemailer.createTransport({
        host,
        port,
        auth: { user: username, pass },
      });

    case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.CUSTOM:
    default:
      return nodemailer.createTransport({
        host,
        port,
        secure: secure ?? false,
        auth: { user: username, pass },
      });
  }
};

export const mailerSendFn = async ({
  from_name,
  from_email,
  to,
  subject,
  html,
  text,
  template,
  data,
  attachments,
  provider,
  host,
  port,
  username,
  pass,
  secure,
  apiKey,
  region,
}: {
  from_name: string;
  from_email: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  data?: Record<string, any>;
  attachments?: Array<{ filename: string; path: string }>;
  provider: TSettingsEmailProviderType;
  host?: string;
  port?: number;
  username?: string;
  pass?: string;
  secure?: boolean;
  apiKey?: string;
  region?: string;
}): Promise<IBaseResponse> => {
  try {
    const transporter = buildTransporterFn({
      provider,
      host,
      port,
      username,
      pass,
      secure,
      apiKey,
      region,
    });

    const renderedHtml = template ? compileTemplateFn(template, data || {}) : html;

    const from = `"${from_name}" <${from_email}>`;

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html: renderedHtml,
      attachments,
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Email sent successfully',
      data: {
        message_id: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      },
      meta: null,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: Env.isProduction ? 'Failed to send email' : error.message,
      data: null,
      meta: null,
    };
  }
};
