"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatesButtonBase = exports.ButtonState = void 0;
var Types_1 = require("../../types/Types");
var ButtonState;
(function (ButtonState) {
    ButtonState[ButtonState["Idle"] = 0] = "Idle";
    ButtonState[ButtonState["Hover"] = 1] = "Hover";
    ButtonState[ButtonState["Pressed"] = 2] = "Pressed";
    ButtonState[ButtonState["Disabled"] = 3] = "Disabled";
})(ButtonState = exports.ButtonState || (exports.ButtonState = {}));
var StatesButtonBase = (function (_super) {
    __extends(StatesButtonBase, _super);
    function StatesButtonBase(scene, position, config) {
        var _a;
        var _this = _super.call(this, scene, position.x, position.y) || this;
        _this.name = (_a = config.name) !== null && _a !== void 0 ? _a : '';
        _this.config = config;
        _this.buttonState = ButtonState.Idle;
        _this.initializeBackground();
        _this.initializeTopImage();
        _this.initializeText();
        _this.updateSize();
        _this.changeState(ButtonState.Idle);
        _this.setInteractive({ cursor: 'pointer' });
        _this.isActive = true;
        _this.scene.add.existing(_this);
        _this.bindEventHandlers();
        return _this;
    }
    StatesButtonBase.prototype.lockFromInput = function (lock) {
        if (lock === void 0) { lock = true; }
        if (lock) {
            this.disableInteractive();
            return;
        }
        this.setInteractive({ cursor: 'pointer' });
    };
    StatesButtonBase.prototype.makeActive = function (value) {
        if (value === void 0) { value = true; }
        if (this.isActive === value) {
            return;
        }
        this.isActive = value;
    };
    StatesButtonBase.prototype.setTopImageDisplaySize = function (width, height) {
        if (!this.topImage) {
            return;
        }
        this.topImage.setDisplaySize(width, height);
        this.updateSize();
    };
    StatesButtonBase.prototype.setText = function (text) {
        this.text.setText(text);
    };
    StatesButtonBase.prototype.changeStateToDisabled = function (value) {
        if (value === void 0) { value = true; }
        this.isDisabled = value;
        this.changeState(value ? ButtonState.Disabled : ButtonState.Idle);
    };
    StatesButtonBase.prototype.updateSize = function () {
        var _a;
        var bounds = this.getBounds();
        this.setSize(bounds.width, bounds.height);
        if (!((_a = this.input) === null || _a === void 0 ? void 0 : _a.hitArea)) {
            this.setInteractive({
                hitArea: new Phaser.Geom.Rectangle(0, 0, bounds.width, bounds.height),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                cursor: 'pointer',
            });
        }
        this.input.hitArea.setTo(0, 0, bounds.width, bounds.height);
    };
    StatesButtonBase.prototype.bindEventHandlers = function () {
        var _this = this;
        this.on('pointerup', function () {
            if (_this.buttonState !== ButtonState.Pressed || _this.isDisabled) {
                return;
            }
            _this.changeState(ButtonState.Idle);
            _this.emit(Types_1.ButtonEvent.Clicked, _this.isActive);
        });
        this.on('pointerdown', function () {
            if (_this.isDisabled) {
                return;
            }
            _this.changeState(ButtonState.Pressed);
        });
        this.on('pointerover', function () {
            if (_this.isDisabled) {
                return;
            }
            if (_this.buttonState === ButtonState.Pressed) {
                return;
            }
            _this.changeState(ButtonState.Hover);
            _this.emit(Types_1.ButtonEvent.HoverOver, _this.isActive);
        });
        this.on('pointerout', function () {
            if (_this.isDisabled) {
                return;
            }
            _this.changeState(ButtonState.Idle);
            _this.emit(Types_1.ButtonEvent.HoverOut, _this.isActive);
        });
    };
    StatesButtonBase.prototype.changeState = function (state) {
        this.changeBackgroundTexture(state);
        this.buttonState = state;
        this.applyTextOffset(state);
        this.applyTopImageOffset(state);
    };
    StatesButtonBase.prototype.applyTopImageOffset = function (state) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.topImage) {
            this.setTopImageToDefaultPosition();
            var offset = void 0;
            switch (state) {
                case ButtonState.Hover: {
                    offset = (_b = (_a = this.config.offsets) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b[1];
                    break;
                }
                case ButtonState.Idle: {
                    offset = (_d = (_c = this.config.offsets) === null || _c === void 0 ? void 0 : _c.image) === null || _d === void 0 ? void 0 : _d[0];
                    break;
                }
                case ButtonState.Pressed: {
                    offset = (_f = (_e = this.config.offsets) === null || _e === void 0 ? void 0 : _e.image) === null || _f === void 0 ? void 0 : _f[2];
                    break;
                }
            }
            this.topImage.x += (_g = offset === null || offset === void 0 ? void 0 : offset.x) !== null && _g !== void 0 ? _g : 0;
            this.topImage.y += (_h = offset === null || offset === void 0 ? void 0 : offset.y) !== null && _h !== void 0 ? _h : 0;
        }
    };
    StatesButtonBase.prototype.applyTextOffset = function (state) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.text) {
            this.setTextToDefaultPosition();
            var offset = void 0;
            switch (state) {
                case ButtonState.Hover: {
                    offset = (_b = (_a = this.config.offsets) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b[1];
                    break;
                }
                case ButtonState.Idle: {
                    offset = (_d = (_c = this.config.offsets) === null || _c === void 0 ? void 0 : _c.text) === null || _d === void 0 ? void 0 : _d[0];
                    break;
                }
                case ButtonState.Pressed: {
                    offset = (_f = (_e = this.config.offsets) === null || _e === void 0 ? void 0 : _e.text) === null || _f === void 0 ? void 0 : _f[2];
                    break;
                }
            }
            this.text.x += (_g = offset === null || offset === void 0 ? void 0 : offset.x) !== null && _g !== void 0 ? _g : 0;
            this.text.y += (_h = offset === null || offset === void 0 ? void 0 : offset.y) !== null && _h !== void 0 ? _h : 0;
        }
    };
    StatesButtonBase.prototype.setTopImageToDefaultPosition = function () {
        var _a;
        (_a = this.topImage) === null || _a === void 0 ? void 0 : _a.setPosition(0, 0);
    };
    return StatesButtonBase;
}(Phaser.GameObjects.Container));
exports.StatesButtonBase = StatesButtonBase;
