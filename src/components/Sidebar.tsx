import React, { useState, useEffect } from "react";
import { useStore, EventGroup, getMaxGroups, DecodedAppState } from "../store";
import { format, isBefore } from "date-fns";
import CalIcon from "./icons/CalIcon";
import PencilIcon from "./icons/PencilIcon";
import TrashIcon from "./icons/TrashIcon";
import XIcon from "./icons/XIcon";
import SaveIcon from "./icons/SaveIcon";
import MergeIcon from "./icons/MergeIcon";
import PlusIcon from "./icons/PlusIcon";
import SettingsIcon from "./icons/SettingsIcon";
import HelpIcon from "./icons/HelpIcon";
import CopyIcon from "./icons/CopyIcon";
import { decodeStateFromHash } from "../store";

import "./Sidebar.css";

function Sidebar() {
  const {
    startDate,
    includeWeekends,
    showToday,
    eventGroups,
    selectedGroupId,
    setStartDate,
    setIncludeWeekends,
    setShowToday,
    setShowHelpModal,
    addEventGroup,
    updateEventGroup,
    deleteEventGroup,
    selectEventGroup,
    isProUser,
    firstDayOfWeek,
    setFirstDayOfWeek,
    addDateRange,
  } = useStore();
  const maxGroups = getMaxGroups(isProUser);
  const [newEventName, setNewEventName] = useState("");
  const [editingGroup, setEditingGroup] = useState<EventGroup | null>(null);
  const [rawStartDate, setRawStartDate] = useState<string>(
    format(startDate, "yyyy-MM"),
  );
  const [rawUrlInput, setRawUrlInput] = useState("");
  const [urlInputError, setUrlInputError] = useState(false);

  const isValidDate = (rawDate: string): boolean => {
    const [year, month] = rawDate.split("-");
    return (
      year.length === 4 && typeof month !== "undefined" && month.length === 2
    );
  };

  // Add effect to select the first group if none is selected
  useEffect(() => {
    if (!selectedGroupId && eventGroups.length > 0) {
      selectEventGroup(eventGroups[0].id);
    }
  }, [selectedGroupId, eventGroups, selectEventGroup]);

  const handleAddGroup = () => {
    if (eventGroups.length < maxGroups) {
      const newGroup = addEventGroup("New Calendar");
      selectEventGroup(newGroup.id);
    }
  };

  const handleUpdateGroup = () => {
    if (editingGroup && newEventName.trim()) {
      updateEventGroup(editingGroup.id, newEventName.trim());
      setEditingGroup(null);
      setNewEventName("");
    }
  };

  const handleEditClick = (group: EventGroup) => {
    setEditingGroup(group);
    setNewEventName(group.name);
    selectEventGroup(group.id);
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setNewEventName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, group: EventGroup) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editingGroup?.id !== group.id) {
        selectEventGroup(group.id);
      }
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawStartDate(e.target.value);
    try {
      if (isValidDate(e.target.value)) {
        const [year, month] = e.target.value.split("-").map(Number);
        const newDate = new Date(year, month - 1, 1);
        setStartDate(newDate);
      }
    } catch (error) {
      console.error("Invalid date format", error);
    }
  };

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawUrlInput(e.target.value);
    setUrlInputError(false);
  };

  const handleAddFromUrl = () => {
    // Extract the data string from the pasted URL
    let decodedState: DecodedAppState;
    try {
      const dataHash = rawUrlInput.split("#")[1];
      if (dataHash === undefined) {
        throw new Error("Error: could not extract data hash from URL");
      }
      const rawDecodedState = decodeStateFromHash(dataHash);
      if (rawDecodedState === null) {
        throw new Error(
          "Error: could not decode state from data hash: " + dataHash,
        );
      }
      decodedState = rawDecodedState;
    } catch (_error) {
      setUrlInputError(true);
      return;
    }

    /**
     * Merge broader settings from the decoded state.
     *
     * We use the decoded state's `startDate` if it's earlier,
     * as otherwise we risk hiding some events earlier than
     * the current startDate.
     *
     * If the decoded state's `includeWeekends` if set to true,
     * we ensure the current `includeWeekends` is also true,
     * as otherwise we risk hiding weekends.
     *
     * We ignore `showToday` and `firstDayOfWeek`, these seem
     * less risky and more like viewer preferences, which
     * don't feel as intuitive to inherit from decoded state.
     */
    // Set startDate to the decoded state if it's earlier
    if (isBefore(decodedState.startDate, startDate)) {
      setStartDate(decodedState.startDate);
    }
    // Set includeWeekends to true if the decoded state has it set
    if (decodedState.includeWeekends && !includeWeekends) {
      setIncludeWeekends(true);
    }
    // Add event groups from the decoded state
    for (const { name, ranges } of decodedState.eventGroups) {
      if (eventGroups.length < maxGroups) {
        const newGroup = addEventGroup(name);
        // Set color
        selectEventGroup(newGroup.id);
        for (const range of ranges) {
          addDateRange(newGroup.id, range);
        }
      }
    }

    // Reset the URL input, we've successfully merged all the data
    setRawUrlInput("");
  };

  const helpAndCopy = () => {
    return (
      <div className="sidebar-footer-buttons">
        <button
          className="footer-button"
          onClick={() => setShowHelpModal(true)}
          aria-label="Show instructions"
        >
          <HelpIcon color="#000" /> Help
        </button>
        <button
          className="footer-button"
          onClick={handleCopyUrl}
          aria-label="Copy URL to clipboard"
        >
          <CopyIcon color="#000" /> Copy URL
        </button>
      </div>
    );
  };

  const creatorLink = () => {
    return (
      <div className="sidebar-footer-buttons">
        <a
          href="https://github.com/cassidoo/pocketcal"
          target="_blank"
          className="footer-button"
        >
          Support PocketCal's creator ↗
        </a>
      </div>
    );
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">
          Pocket<span className="logo-cal">Cal</span>{" "}
          {isProUser && <span className="pro-badge">Pro</span>}
        </h1>
        <a href="/" target="_blank" className="new-link">
          New ↗
        </a>
      </div>

      <h3>
        <CalIcon height={20} />
        Calendars ({eventGroups.length}/{maxGroups})
      </h3>
      <div className="event-groups-list" role="list">
        {eventGroups.map((group) => (
          <div
            key={group.id}
            className={`event-group-item ${
              selectedGroupId === group.id ? "selected" : ""
            } ${editingGroup?.id === group.id ? "editing" : ""}`}
            onClick={() =>
              editingGroup?.id !== group.id && selectEventGroup(group.id)
            }
            onKeyDown={(e) => handleKeyDown(e, group)}
            tabIndex={editingGroup?.id !== group.id ? 0 : -1}
            role="listitem"
            aria-selected={selectedGroupId === group.id}
            aria-label={`Calendar: ${group.name}`}
          >
            <span
              className="color-indicator"
              style={{ backgroundColor: group.color }}
            ></span>
            {editingGroup?.id === group.id ? (
              <>
                <input
                  type="text"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdateGroup();
                    } else if (e.key === "Escape") {
                      handleCancelEdit();
                    }
                  }}
                  autoFocus
                  className="group-name-input"
                  aria-label="Edit calendar name"
                />
                <div className="group-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateGroup();
                    }}
                    className="save-button"
                    aria-label="Save calendar name"
                  >
                    <SaveIcon color="#000" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelEdit();
                    }}
                    className="cancel-button"
                    aria-label="Cancel editing"
                  >
                    <XIcon color="#000" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="group-name">{group.name}</span>
                <div className="group-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(group);
                    }}
                    disabled={!!editingGroup}
                    className="edit-button"
                    aria-label={`Edit ${group.name}`}
                  >
                    <PencilIcon color="#000" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEventGroup(group.id);
                    }}
                    disabled={!!editingGroup}
                    className="delete-button"
                    aria-label={`Delete ${group.name}`}
                  >
                    <TrashIcon color="#000" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {eventGroups.length < maxGroups && (
        <>
          <button
            className="add-group-button"
            onClick={handleAddGroup}
            disabled={!!editingGroup}
          >
            <PlusIcon height={18} /> Add new calendar
          </button>
          <h3>
            <MergeIcon height={20} /> Merge
          </h3>
          <div className="setting-item">
            <label htmlFor="add-from-url-input">PocketCal URL:</label>
            <input
              type="month"
              id="add-from-url-input"
              value={rawUrlInput}
              onChange={handleUrlInputChange}
            />
          </div>
          {urlInputError ? (
            <p className="input-error-message">
              Dang it, we can't seem to parse this URL.
              <br />
              Please enter a valid PocketCal URL.
            </p>
          ) : null}
          <button
            className="add-group-button"
            onClick={handleAddFromUrl}
            disabled={!!editingGroup}
          >
            <PlusIcon height={18} /> Add calendars from URL
          </button>
        </>
      )}

      <>
        <h3>
          <SettingsIcon height={20} /> Settings
        </h3>
        <div className="setting-item">
          <label htmlFor="start-date">Start Month:</label>
          <input
            type="month"
            id="start-date"
            value={
              isValidDate(rawStartDate)
                ? format(startDate, "yyyy-MM")
                : rawStartDate
            }
            onChange={handleStartDateChange}
          />
        </div>
        <div className="setting-item">
          <label htmlFor="first-day-of-week">Start the Week on:</label>
          <select
            id="first-day-of-week"
            value={firstDayOfWeek}
            onChange={(e) => setFirstDayOfWeek(Number(e.target.value) as 0 | 1)}
          >
            <option value={0}>Sunday</option>
            <option value={1}>Monday</option>
          </select>
        </div>
        <div className="setting-item">
          <label htmlFor="include-weekends">Include Weekends:</label>
          <input
            type="checkbox"
            id="include-weekends"
            checked={includeWeekends}
            onChange={(e) => setIncludeWeekends(e.target.checked)}
          />
        </div>
        <div className="setting-item">
          <label htmlFor="show-today">Highlight Today:</label>
          <input
            type="checkbox"
            id="show-today"
            checked={showToday}
            onChange={(e) => setShowToday(e.target.checked)}
          />
        </div>
      </>

      <div className="sidebar-footer">
        {creatorLink()}
        {helpAndCopy()}
      </div>
    </div>
  );
}

export default Sidebar;
