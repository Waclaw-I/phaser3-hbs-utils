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
exports.StatesButton = void 0;
var StatesButtonBase_1 = require("./StatesButtonBase");
var StatesButton = (function (_super) {
    __extends(StatesButton, _super);
    function StatesButton(scene, position, config) {
        return _super.call(this, scene, position, config) || this;
    }
    StatesButton.prototype.setTopImage = function (key, frame) {
        this.config.topImage = {
            key: key,
            frame: frame,
        };
        if (!this.topImage) {
            this.topImage = this.scene.add.image(0, -this.background.displayHeight * 0.5, key, frame).setOrigin(0.5, 0.5);
            this.add(this.topImage);
            return;
        }
        this.topImage.setTexture(key, frame);
    };
    StatesButton.prototype.changeBackgroundTexture = function (state) {
        this.background.setTexture(this.config.background.key, this.config.background.frame + "/" + state);
    };
    StatesButton.prototype.initializeBackground = function () {
        var _a;
        this.background = this.scene.add.image(0, 0, this.config.background.key, this.config.background.frame + "/" + StatesButtonBase_1.ButtonState.Idle)
            .setOrigin(0.5, 1).setScale((_a = this.config.scale) !== null && _a !== void 0 ? _a : 1);
        this.background.y += this.background.displayHeight * 0.5;
        this.add(this.background);
    };
    StatesButton.prototype.initializeText = function () {
        var _a, _b, _c, _d;
        if (this.config.bitmapTextConfig) {
            var textConfig = this.config.bitmapTextConfig;
            this.text = this.scene.add.bitmapText(0, 0, textConfig.font, (_a = textConfig.text) !== null && _a !== void 0 ? _a : '', (_b = textConfig.size) !== null && _b !== void 0 ? _b : 20)
                .setOrigin((_d = (_c = textConfig.origin) === null || _c === void 0 ? void 0 : _c.x) !== null && _d !== void 0 ? _d : 0.5, 0.6);
            if (this.config.bitmapTextConfig.size) {
                this.text.setFontSize(this.config.bitmapTextConfig.size);
            }
            this.setTextToDefaultPosition();
            if (textConfig.color) {
                this.text.setTint(textConfig.color);
            }
            this.add(this.text);
        }
    };
    StatesButton.prototype.initializeTopImage = function () {
        if (!this.config.topImage) {
            return;
        }
        this.topImage = this.scene.add.image(0, -this.background.displayHeight * 0.5, this.config.topImage.key, this.config.topImage.frame)
            .setOrigin(0.5, 0.5);
        this.add(this.topImage);
    };
    StatesButton.prototype.setTextToDefaultPosition = function () {
        var _a;
        (_a = this.text) === null || _a === void 0 ? void 0 : _a.setPosition(0, this.background.y - this.background.displayHeight * 0.5);
    };
    return StatesButton;
}(StatesButtonBase_1.StatesButtonBase));
exports.StatesButton = StatesButton;
