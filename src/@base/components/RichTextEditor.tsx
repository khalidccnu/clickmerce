import { Env } from '.environments';
import { getAuthToken } from '@modules/auth/lib/utils/client';
import { Spin } from 'antd';
import { type IJoditEditorProps, Jodit } from 'jodit-react';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
  loading: () => <Spin />,
});

interface IProps {
  isDark?: boolean;
  disabled?: boolean;
  makePublicFile?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const RichTextEditor: React.FC<IProps> = ({
  isDark = false,
  disabled = false,
  makePublicFile = false,
  placeholder = 'Start writing...',
  value = '',
  onChange,
}) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(value);

  const beautifyHtmlFn = (html: string) => {
    if (html === '<p><br></p>') return '';
    else {
      return html
        ?.replace(/ role="[^"]*"/g, '')
        .replace(/ dir="[^"]*"/g, '')
        .replace(/ align="[^"]*"/g, '')
        .replace(/<p><span>(.*?)<\/span><\/p>/g, '<p>$1</p>');
    }
  };

  useEffect(() => {
    setContent(value);
  }, [value]);

  const config = useMemo<IJoditEditorProps['config']>(
    () => ({
      theme: isDark ? 'dark' : 'default',
      readonly: false,
      disabled,
      placeholder,
      height: 400,
      style: { backgroundColor: isDark ? '#141414' : '#fff' },
      className: 'richtext_editor',
      tabIndex: 1,
      statusbar: false,
      disablePlugins: ['file'],
      extraButtons: [
        {
          name: 'tab',
          text: 'Tab',
          exec: (editor: Jodit) => {
            editor.s.insertHTML('&nbsp;&nbsp;&nbsp;&nbsp;');
            editor.synchronizeValues();
          },
        },
        {
          name: 'clear',
          text: 'Clear',
          exec: (editor: Jodit) => {
            editor.value = '';
            editor.synchronizeValues();
          },
        },
      ],
      uploader: {
        url: `${Env.apiUrl}/uploads`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        filesVariableName: function () {
          return 'files';
        },
        prepareData: function (data: any) {
          data.append('make_public', makePublicFile);
          return data;
        },
        isSuccess: function (e: any) {
          return e?.success;
        },
        getMessage: function (e: any) {
          return e?.message;
        },
        process: function (res: any) {
          return res;
        },
        defaultHandlerSuccess: function (this: any, res: any) {
          if (res?.data?.[0]) {
            const elem = this.createInside.element('img');
            elem.setAttribute('src', res?.data?.[0]);
            this.s.insertImage(elem as HTMLImageElement, null, this.o.imageDefaultWidth);
          }
        },
        defaultHandlerError: function (this: any, e: Error) {
          this?.j?.e?.fire('errorMessage', e?.message);
        },
        contentType: function (this: any, e: any): any {
          return (
            (void 0 === this?.jodit?.ownerWindow?.FormData || 'string' == typeof e) &&
            'application/x-www-form-urlencoded; charset=UTF-8'
          );
        },
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDark, placeholder, disabled],
  );

  return (
    <React.Fragment>
      <JoditEditor
        ref={editorRef}
        config={config}
        value={content}
        onBlur={(newContent) => setContent(beautifyHtmlFn(newContent))}
        onChange={(newContent) => onChange?.(beautifyHtmlFn(newContent))}
      />
      <style jsx global>{`
        .richtext_editor {
          border-color: ${isDark ? '#424242' : '#d9d9d9'} !important;
          border-radius: 8px !important;
        }

        .richtext_editor .jodit-toolbar__box {
          background-color: ${isDark ? '#141414' : '#fff'} !important;
          border-radius: 8px 8px 0 0 !important;
        }

        .richtext_editor .jodit-workplace {
          border-radius: 0 0 8px 8px !important;
        }
      `}</style>
    </React.Fragment>
  );
};

export default RichTextEditor;
