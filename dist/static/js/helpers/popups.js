"use strict";

;

(function (global) {
  'use strict';

  var Popups = {
    $overlay: null,
    $popup: null,
    popupMode: null,
    listeners: {},
    beforeListeners: {},
    popupsOpened: [],
    disabled: false,
    bodyScroll: null,
    showOverlay: function showOverlay(callback) {
      this.createOverlay();
      this.$overlay.fadeIn(callback);
    },
    hideOverlay: function hideOverlay() {
      this.$overlay.fadeOut();
    },
    createOverlay: function createOverlay() {
      var that = this;

      if (this.$overlay !== null) {
        return false;
      }

      this.$overlay = $('<div/>').addClass('popup').css('display', 'none').appendTo($('body'));
      this.$overlay.on('click', function (e) {
        var target = $(e.target);

        if (target.hasClass('popup')) {
          that.hide();
          $('body').removeClass('popup-opened');

          if (window.innerWidth < 768) {
            window.scrollBy(0, that.bodyScroll);
          }
        }
      });
      this.$overlay.on('click', '.js-close-wnd', function () {
        that.hide();
        $('body').removeClass('popup-opened');

        if (window.innerWidth < 768) {
          window.scrollBy(0, that.bodyScroll);
        }

        return false;
      });
    },
    open: function open(url, callback) {
      if (this.disabled) {
        return;
      }

      var that = this;

      if (this.$popup && this.$popup.length) {
        that.hide();
      }

      var $loader = $('<div class="preloader-overlay" style="display: block"><div class="preloader-block"> <div class="preloader-block__circle_01"></div> <div class="preloader-block__circle_02"></div> <div class="preloader-block__circle_03"></div> <div class="preloader-block__circle_04"></div> <div class="preloader-block__circle_05"></div> <div class="preloader-block__circle_06"></div> <div class="preloader-block__circle_07"></div> <div class="preloader-block__circle_08"></div> <div class="preloader-block__circle_09"></div> <div class="preloader-block__circle_10"></div> <div class="preloader-block__circle_11"></div> <div class="preloader-block__circle_12"></div> </div> </div> ');
      that.$overlay.append($loader);
      that.popupMode = 'ajax';
      this.showOverlay(function () {
        that.$popup = that.$overlay;

        if (that.$popup.length === 1) {
          $loader.remove();
        }

        $.get(url, function (response) {
          that.$popup.html(response);
          var popupId = that.$popup.find('.popup').data('popup-id');

          if (popupId in that.listeners) {
            var listeners = that.listeners[popupId];

            for (var i = 0; i < listeners.length; i++) {
              listeners[i](that.$popup);
            }
          }

          if (typeof callback !== 'undefined') {
            callback(that.$popup, popupId, url);
          }
        });
      });
    },
    openById: function openById(id, callback) {
      if (this.disabled) {
        return;
      }

      var that = this;
      $('body').addClass('popup-opened');
      var $popup = $('#' + id);

      if ($popup.length === 0) {
        return;
      }

      if (this.$popup && this.$popup.length) {
        that.hide();
      }

      that.popupMode = 'id';

      var waitCallback = function waitCallback(callback) {
        callback();
      };

      var popupId = $popup.data('popup-id');

      if (popupId in this.beforeListeners) {
        waitCallback = this.beforeListeners[popupId];
      }

      waitCallback(function () {
        that.showOverlay(function () {
          $('body').addClass('popup-opened');
          $popup.removeClass('phide').addClass('pshow');
          that.$popup = that.$overlay;
          that.$popup.append($popup);
          var popupId = that.$popup.find('.popup__box').data('popup-id');

          if (popupId in that.listeners) {
            var listeners = that.listeners[popupId];

            for (var i = 0; i < listeners.length; i++) {
              listeners[i](that.$popup.find('.popup__box'), that.popupsOpened.indexOf(id) === -1);
            }
          }

          that.popupsOpened.push(id);

          if (typeof callback !== 'undefined') {
            callback(that.$popup, popupId);
          }
        });
      });
    },
    openFrame: function openFrame(url, width, height) {
      if (this.disabled) {
        return;
      }

      var that = this;

      if (this.$popup && this.$popup.length) {
        that.hide();
      }

      var $frame = $('<iframe/>').hide();
      $frame.attr('src', url);
      $frame.attr('width', '100%');
      $frame.attr('height', '100%');
      $frame.attr('border', 0);
      $frame.css('border', 0);
      var popupWidth = width ? width : 300;
      var popupHeight = height ? height : 300;
      var $popup = $('<div/>').addClass('popup__box').css({
        width: popupWidth + 'px',
        height: popupHeight + 'px'
      }).addClass('popup__frame');
      var $loader = $('<div class="preloader-overlay" style="display: block"><div class="preloader-block"> <div class="preloader-block__circle_01"></div> <div class="preloader-block__circle_02"></div> <div class="preloader-block__circle_03"></div> <div class="preloader-block__circle_04"></div> <div class="preloader-block__circle_05"></div> <div class="preloader-block__circle_06"></div> <div class="preloader-block__circle_07"></div> <div class="preloader-block__circle_08"></div> <div class="preloader-block__circle_09"></div> <div class="preloader-block__circle_10"></div> <div class="preloader-block__circle_11"></div> <div class="preloader-block__circle_12"></div> </div> </div> ');
      $popup.append($loader);
      $popup.append('<a href="#" class="popup__close icon-close-popup js-close-wnd"></a>');
      $popup.append($frame);
      $frame.on('load', function () {
        $loader.remove();
        $frame.removeClass('phide').addClass('pshow');
      });
      this.showOverlay(function () {
        that.$popup.append($popup);
      });
    },
    hide: function hide() {
      var that = this;

      if (this.popupMode === 'id') {
        if (this.$popup) {
          this.$popup.find('.popup__box').removeClass('pshow').addClass('phide').appendTo($('body'));
          this.$popup.find('.popup__box').remove();
        }
      } else if (this.popupMode === 'ajax') {
        if (this.$popup) {
          this.$popup.find('.popup__box').remove();
        }
      }

      this.hideOverlay();
    },
    bindEvents: function bindEvents() {
      var that = this;
      $('body').on('click', '[data-popup-ajax]:not([data-popup-auto=0])', function () {
        if (window.innerWidth < 768) {
          that.bodyScroll = $(window).scrollTop();
        }

        $('body').addClass('popup-opened');
        Popups.open($(this).data('popup-ajax'));
        return false;
      }).on('click', '[data-popup-frame]:not([data-popup-auto=0])', function () {
        if (window.innerWidth < 768) {
          that.bodyScroll = $(window).scrollTop();
        }

        $('body').addClass('popup-opened');
        Popups.openFrame($(this).data('popup-frame'), $(this).data('frame-width'), $(this).data('frame-height'));
        return false;
      }).on('click', '[data-popup]:not([data-popup-auto=0])', function () {
        if (window.innerWidth < 768) {
          that.bodyScroll = $(window).scrollTop();
        }

        $('body').addClass('popup-opened');
        Popups.openById($(this).data('popup'));
        return false;
      });
    },
    addBeforeListener: function addBeforeListener(popupId, callback) {
      this.beforeListeners[popupId] = callback;
    },
    addListener: function addListener(popupId, callback) {
      if (popupId in this.listeners === false) {
        this.listeners[popupId] = [];
      }

      this.listeners[popupId].push(callback);
    },
    Init: function Init() {
      this.bindEvents();
    },
    Disable: function Disable() {
      this.disabled = true;
    }
  };
  global.Popups = Popups;
  Popups.Init();
})(window);