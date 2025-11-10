import { Env } from '.environments';
import { IBaseResponse } from '@base/interfaces';
import { ENUM_SETTINGS_SMS_PROVIDER_TYPES, TSettingsSmsProviderType } from '@modules/settings/lib/enums';
import AWS from 'aws-sdk';
import fs from 'fs';
import handlebars from 'handlebars';
import fetch from 'node-fetch';
import path from 'path';
import twilio, { Twilio } from 'twilio';

const compileSmsTemplateFn = (templateName: string, data: Record<string, any>): string => {
  const templatePath = path.join(process.cwd(), 'sms-templates', `${templateName}.hbs`);
  const source = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(source);

  return template(data);
};

const smsClientFn = ({
  provider,
  accountSid,
  authToken,
  apiKey,
  apiSecret,
  region,
}: {
  provider: TSettingsSmsProviderType;
  accountSid?: string;
  authToken?: string;
  apiKey?: string;
  apiSecret?: string;
  region?: string;
}): Twilio | AWS.SNS | { apiKey?: string; apiSecret?: string } => {
  switch (provider) {
    case ENUM_SETTINGS_SMS_PROVIDER_TYPES.TWILIO:
      return twilio(accountSid, authToken);

    case ENUM_SETTINGS_SMS_PROVIDER_TYPES.AWS_SNS:
      return new AWS.SNS({
        region,
        credentials: {
          accessKeyId: apiKey,
          secretAccessKey: apiSecret,
        },
      });

    case ENUM_SETTINGS_SMS_PROVIDER_TYPES.VONAGE:
      return { apiKey, apiSecret };

    case ENUM_SETTINGS_SMS_PROVIDER_TYPES.CUSTOM:
    default:
      return null;
  }
};

export const smsSendFn = async ({
  to,
  message,
  template,
  data,
  senderId,
  provider,
  accountSid,
  authToken,
  apiKey,
  apiSecret,
  region,
  endpoint,
}: {
  to: string;
  message?: string;
  template?: string;
  data?: Record<string, any>;
  senderId?: string;
  provider: TSettingsSmsProviderType;
  accountSid?: string;
  authToken?: string;
  apiKey?: string;
  apiSecret?: string;
  region?: string;
  endpoint?: string;
}): Promise<IBaseResponse> => {
  try {
    const client = smsClientFn({
      provider,
      accountSid,
      authToken,
      apiKey,
      apiSecret,
      region,
    });

    const text = template ? compileSmsTemplateFn(template, data || {}) : message;

    let result;

    switch (provider) {
      case ENUM_SETTINGS_SMS_PROVIDER_TYPES.TWILIO:
        if (client && 'messages' in client) {
          result = await client.messages.create({
            body: text,
            from: senderId,
            to,
          });
        }
        break;

      case ENUM_SETTINGS_SMS_PROVIDER_TYPES.AWS_SNS:
        if (client && 'publish' in client) {
          result = await client
            .publish({
              Message: text,
              PhoneNumber: to,
              MessageAttributes: {
                'AWS.SNS.SMS.SenderID': { DataType: 'String', StringValue: senderId || 'App' },
              },
            })
            .promise();
        }
        break;

      case ENUM_SETTINGS_SMS_PROVIDER_TYPES.VONAGE:
        result = await fetch('https://rest.nexmo.com/sms/json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: apiKey,
            api_secret: apiSecret,
            from: senderId || 'App',
            to,
            text,
          }),
        }).then((r) => r.json());
        break;

      case ENUM_SETTINGS_SMS_PROVIDER_TYPES.ALPHA_SMS:
        result = await fetch(`${endpoint}/sendsms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: apiKey, to, msg: text }),
        }).then((r) => r.json());
        break;

      case ENUM_SETTINGS_SMS_PROVIDER_TYPES.CUSTOM:
      default:
    }

    return {
      success: true,
      statusCode: 200,
      message: 'SMS sent successfully',
      data: result,
      meta: null,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: Env.isProduction ? 'Failed to send SMS' : error.message,
      data: null,
      meta: null,
    };
  }
};
