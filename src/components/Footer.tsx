
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="telecare-container py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Logo and description */}
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-telecare-500">{t('general.appName')}</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              TeleCare provides progressive, and affordable healthcare, accessible on mobile and online for everyone
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-telecare-500">
                  About
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-sm text-gray-600 hover:text-telecare-500">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-telecare-500">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Region */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Region
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm text-gray-600">
                  India
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-600">
                  USA
                </span>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Help
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/help" className="text-sm text-gray-600 hover:text-telecare-500">
                  Help center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-telecare-500">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-telecare-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-telecare-500">
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Newsletter
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              Stay up to date with our latest features and releases.
            </p>
          </div>
        </div>

        {/* Bottom part */}
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TeleCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
