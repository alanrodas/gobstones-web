"use strict";

Polymer({
  is: 'metadata-editor',
  properties: {
    metadata: {
      type: Object,
      value: {}
    }
  },
  behaviors: [Polymer.BusListenerBehavior, Polymer.PermissionsBehavior, Polymer.LocalizationBehavior],

  ready: function ready() {
    this.set("metadata", this._defaultMetadata());

    this.stylist = new Stylist();
    this.stylist.setUpMetadataEditorCustomizations();
  },

  getMetadata: function getMetadata() {
    return this.metadata;
  },

  setMetadata: function setMetadata(config) {
    this.metadata = config;
  },

  reset: function reset() {
    this.set("metadata", this._defaultMetadata());
  },

  _defaultMetadata: function _defaultMetadata() {
    return {
      library: {
        visible: true
      },
      source: {
        visible: true,
        percentage: 0.6
      },
      board: {
        visible_edition: true,
        collapse_toolbox: false,
        user_permissions: {
          can_change_initial_board: true,
          can_change_initial_board_source: true,
          can_edit_board: true,
          can_view_size_section: true,
          can_view_attire_section: true
        }
      },
      execution_speed: {
        user_permissions: {
          can_change_speed: true
        }
      },
      attire: {
        user_permissions: {
          can_toggle_visibility: true
        }
      },
      blocks: {
        visible: [],
        disabled: []
      }
    };
  }
});