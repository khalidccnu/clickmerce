import { Env } from '.environments';
import BrandLogo from '@base/components/BrandLogo';
import CustomLink from '@base/components/CustomLink';
import ThemeToggler from '@base/components/ThemeToggler';
import { Paths } from '@lib/constant/paths';
import { useSettingsIdentity } from '@lib/context/SettingsIdentityContext';
import { ENUM_PAGE_TYPES } from '@modules/pages/lib/enums';
import { Grid } from 'antd';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaEnvelope, FaFacebook, FaLocationDot, FaPhone } from 'react-icons/fa6';

const LandingFooter = () => {
  const screens = Grid.useBreakpoint();
  const { settingsIdentity, pages } = useSettingsIdentity();
  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);

  const { aboutPage, privacyPolicyPage, termsAndConditionsPage, refundPolicyPage } = useMemo(() => {
    return {
      aboutPage: pages?.find((page) => page.type === ENUM_PAGE_TYPES.ABOUT),
      privacyPolicyPage: pages?.find((page) => page.type === ENUM_PAGE_TYPES.PRIVACY_POLICY),
      termsAndConditionsPage: pages?.find((page) => page.type === ENUM_PAGE_TYPES.TERMS_AND_CONDITIONS),
      refundPolicyPage: pages?.find((page) => page.type === ENUM_PAGE_TYPES.REFUND_POLICY),
    };
  }, [pages]);

  const hasPageLinks =
    aboutPage?.is_active ||
    privacyPolicyPage?.is_active ||
    termsAndConditionsPage?.is_active ||
    refundPolicyPage?.is_active;

  const hasContactInfo = settingsIdentity?.address || settingsIdentity?.phone || settingsIdentity?.email;

  const footerMiddleDivideCount = hasPageLinks && hasContactInfo ? 3 : hasPageLinks || hasContactInfo ? 2 : 1;

  useEffect(() => {
    if (footerRef.current) setFooterHeight(footerRef.current.offsetHeight);
  }, [footerRef.current?.offsetHeight]);

  return (
    <React.Fragment>
      <div className="footer_height_emulator" style={{ height: footerHeight + 'px' }}></div>
      <footer ref={footerRef}>
        <div className="container">
          <div className="top">
            <div className="logo_container">
              <BrandLogo />
            </div>
            {(settingsIdentity?.fb_url || settingsIdentity?.ig_url || settingsIdentity?.yt_url) && (
              <ul className="social_links_wrapper">
                {settingsIdentity?.fb_url && (
                  <li className="social_link">
                    <CustomLink target="_blank" href={settingsIdentity?.fb_url} rel="noreferrer">
                      <FaFacebook />
                    </CustomLink>
                  </li>
                )}
                {settingsIdentity?.ig_url && (
                  <li className="social_link">
                    <CustomLink target="_blank" href={settingsIdentity?.ig_url} rel="noreferrer">
                      <FaInstagram />
                    </CustomLink>
                  </li>
                )}
                {settingsIdentity?.yt_url && (
                  <li className="social_link">
                    <CustomLink target="_blank" href={settingsIdentity?.yt_url} rel="noreferrer">
                      <FaYoutube />
                    </CustomLink>
                  </li>
                )}
              </ul>
            )}
          </div>
          <div
            className="middle"
            style={
              {
                '--footer-middle-divide-count': footerMiddleDivideCount,
              } as React.CSSProperties
            }
          >
            <div className="item">
              <h6 className="title">About us</h6>
              <p className="description">{settingsIdentity?.description || Env.webDescription}</p>
            </div>
            {hasPageLinks && (
              <div className="item">
                <h6 className="title">Useful Link</h6>
                <ul className="links_wrapper">
                  {aboutPage?.is_active && (
                    <li className="link">
                      <Link href={Paths.about}>About us</Link>
                    </li>
                  )}
                  {privacyPolicyPage?.is_active && (
                    <li className="link">
                      <Link href={Paths.privacyPolicy}>Privacy Policy</Link>
                    </li>
                  )}
                  {termsAndConditionsPage?.is_active && (
                    <li className="link">
                      <Link href={Paths.termsAndConditions}>Terms and Conditions</Link>
                    </li>
                  )}
                  {refundPolicyPage?.is_active && (
                    <li className="link">
                      <Link href={Paths.refundPolicy}>Refund Policy</Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
            {hasContactInfo && (
              <div className="item">
                <h6 className="title">Get in touch</h6>
                <ul className="links_wrapper">
                  {settingsIdentity?.address && (
                    <li className="link">
                      <span className="icon_container">
                        <FaLocationDot size={12} />
                      </span>
                      <p>{settingsIdentity?.address}</p>
                    </li>
                  )}
                  {settingsIdentity?.phone && (
                    <li className="link">
                      <span className="icon_container">
                        <FaPhone size={12} />
                      </span>
                      <a href={`tel:${settingsIdentity?.phone}`}>{settingsIdentity?.phone}</a>
                    </li>
                  )}
                  {settingsIdentity?.email && (
                    <li className="link">
                      <span className="icon_container">
                        <FaEnvelope size={12} />
                      </span>
                      <a href={`mailto:${settingsIdentity?.email}`}>{settingsIdentity?.email}</a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className="bottom">
            <p className="copyright">
              Copyright &copy; {new Date().getFullYear()} {settingsIdentity?.name || Env.webTitle}. All rights reserved.
              <br />
              Developed By -{' '}
              <CustomLink
                href={{ pathname: 'https://focket.app', query: { ref: Env.webHostUrl } }}
                target="_blank"
                className="font-semibold"
              >
                FOCKET
              </CustomLink>
            </p>
            {screens.md || <ThemeToggler className="place-self-center mt-4" />}
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default LandingFooter;
