import React from 'react';
import PropTypes from 'prop-types';

const PocketLink = ({ url, title }) => {
  const pocketUrl = `https://getpocket.com/save?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;

  return (
    <a href={pocketUrl} target="_blank" rel="noopener noreferrer">
      <img
        src="https://getpocket.com/favicon.ico"
        alt="Save to Pocket"
        style={{
          width: '20px',
          height: '20px',
          border: 'none',
          maxWidth: 'fit-content',
        }}
      />
    </a>
  );
};

export default PocketLink;

PocketLink.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
