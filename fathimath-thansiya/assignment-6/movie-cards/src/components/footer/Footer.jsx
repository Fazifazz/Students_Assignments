import "./Footer.css";

const FOOTER_COLUMNS = [
  {
    title: "Help Center",
    links: ["FAQ", "Help", "Account", "Media Center"],
  },
  {
    title: "Company",
    links: ["About", "Jobs", "Press", "Contact"],
  },
  {
    title: "Ways to Watch",
    links: ["Terms of Use", "Privacy", "Cookie Preferences",
      "Corporate Information"],
  },
  {
    title: "Connect",
    links: ["Twitter", "Instagram", "Facebook", "YouTube"],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer__inner">
        <div className="footer__brand-row">
          <span className="footer__logo">CINEVERSE</span>
          <div className="footer__social" aria-label="Social links">
            <a className="footer__social-link" href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path fill="currentColor" d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9v-3h2.5V9.4c0-2.5 1.5-3.8 3.7-3.8 1 0 2.1.2 2.1.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6v2H17l-.4 3h-2.6v7A10 10 0 0 0 22 12z"/>
              </svg>
            </a>
            <a className="footer__social-link" href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.3 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.5.4 1.1.4 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.8-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.5.2-1.1.4-2.3.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.3-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.5-.4-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-1.8.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.5-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 2c-3.2 0-3.5 0-4.7.1-1 .1-1.5.2-1.9.4-.5.2-.8.4-1.2.7-.3.3-.6.7-.7 1.2-.2.4-.3.9-.4 1.9-.1 1.2-.1 1.5-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.5.4 1.9.2.5.4.8.7 1.2.3.3.7.6 1.2.7.4.2.9.3 1.9.4 1.2.1 1.5.1 4.7.1s3.5 0 4.7-.1c1-.1 1.5-.2 1.9-.4.5-.2.8-.4 1.2-.7.3-.3.6-.7.7-1.2.2-.4.3-.9.4-1.9.1-1.2.1-1.5.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.5-.4-1.9-.2-.5-.4-.8-.7-1.2-.3-.3-.7-.6-1.2-.7-.4-.2-.9-.3-1.9-.4-1.2-.1-1.5-.1-4.7-.1zm0 3.4a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8zm0 7.2a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6zm5.6-7.4a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
            </a>
            <a className="footer__social-link" href="#" aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path fill="currentColor" d="M22 5.8c-.7.3-1.5.5-2.4.6.9-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.7 1A4.3 4.3 0 0 0 12 9c0 .3 0 .7.1 1A12.2 12.2 0 0 1 3 4.8a4.3 4.3 0 0 0 1.3 5.7c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.5 3.7 3.4 4.1-.6.2-1.3.2-2 .1.6 1.7 2.2 3 4.1 3a8.7 8.7 0 0 1-5.4 1.9H2c2 1.3 4.3 2 6.7 2 8 0 12.4-6.6 12.4-12.4v-.6c.9-.6 1.6-1.4 2.2-2.3z"/>
              </svg>
            </a>
            <a className="footer__social-link" href="#" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path fill="currentColor" d="M22.5 6.5a3 3 0 0 0-2.1-2.1C18.5 4 12 4 12 4s-6.5 0-8.4.4A3 3 0 0 0 1.5 6.5C1 8.4 1 12 1 12s0 3.6.5 5.5a3 3 0 0 0 2.1 2.1c1.9.4 8.4.4 8.4.4s6.5 0 8.4-.4a3 3 0 0 0 2.1-2.1C23 15.6 23 12 23 12s0-3.6-.5-5.5zM10 15.5v-7l6 3.5-6 3.5z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer__columns">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="footer__column">
              <h4 className="footer__column-title">{column.title}</h4>
              <ul className="footer__list">
                {column.links.map((label) => (
                  <li key={label}>
                    <a className="footer__link" href="#">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="footer__legal">
          © {year} Cineverse — built for educational purposes. All movie
          metadata, posters, and artwork are property of their respective owners.
        </p>
      </div>
    </footer>
  );
}
