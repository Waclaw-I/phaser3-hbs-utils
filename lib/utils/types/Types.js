"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonEvent = exports.InputEvent = void 0;
var InputEvent;
(function (InputEvent) {
    InputEvent["PointerDown"] = "pointerdown";
    InputEvent["PointerUp"] = "pointerup";
    InputEvent["PointerOver"] = "pointerover";
    InputEvent["PointerOut"] = "pointerout";
})(InputEvent = exports.InputEvent || (exports.InputEvent = {}));
var ButtonEvent;
(function (ButtonEvent) {
    ButtonEvent["Clicked"] = "Clicked";
    ButtonEvent["HoverOver"] = "HoverOver";
    ButtonEvent["HoverOut"] = "HoverOut";
})(ButtonEvent = exports.ButtonEvent || (exports.ButtonEvent = {}));
