const ACTIONS = {
    JOIN: 'join',
    JOINED: 'joined',
    DISCONNECTED: 'disconnected',
    CODE_CHANGE: 'code-change',
    LANGUAGE_CHANGE: 'language-change',
    SYNC_LANGUAGE: 'SYNC_LANGUAGE',
    SYNC_CODE: 'sync-code',
    LEAVE: 'leave',
    TAKE_CONTROL: 'take-control',
    CONTROLLER_CHANGE: 'controller-change',
    CONTROL_TAKEN: "control_taken",
    SEND_MESSAGE: "send_message", // ✅ New Action for Sending a Message
    RECEIVE_MESSAGE: "receive_message", // ✅ New Action for Receiving a Message
  };
  
  module.exports = ACTIONS;