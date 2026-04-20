import React from "react";
import XIcon from "./icons/XIcon";
import "./Modal.css";

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close instructions"
        >
          <XIcon color="#000" />
        </button>
        <h2>
          Pocket<span>Cal</span> Instructions
        </h2>
        <div className="instructions-content">
          <h3>Features</h3>
          <ul>
            <li>Make a calendar and choose dates to share</li>
            <li>Your calendar data is saved in the URL</li>
            <li>Share your calendar by sharing the URL</li>
            <li>Merge multiple calendar URLs to compare them</li>
          </ul>
          <h3>Navigation</h3>
          <ul>
            <li>
              <strong>Click</strong> on any date to add/edit events
            </li>
            <li>
              <strong>Arrow keys</strong> to move between dates when calendar is
              focused
            </li>
            <li>
              <strong>Enter</strong> or <strong>Space</strong> to toggle the
              selected date
            </li>
          </ul>
          <h3>About</h3>
          <p className="footer">
            PocketCal is built by <a href="https://cassidoo.co/">cassidoo</a>{" "}
            and is open source on{" "}
            <a href="https://github.com/cassidoo/pocketcal">GitHub</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
