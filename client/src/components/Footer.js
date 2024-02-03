import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <a className='iconLinks'href="https://github.com/" target="_blank" rel="noopener noreferrer">
            <GitHubIcon />
          </a>
          <a className='iconLinks'href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"><LinkedInIcon/></a>
        <p>(c) 2023-2024 Ambi Hidalgo</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
