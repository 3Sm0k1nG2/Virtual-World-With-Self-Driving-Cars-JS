import { CONTROL_TYPE_KEYS, CONTROL_TYPE_DUMMY, CONTROL_TYPE_AI } from "../../consts.js";

class Controls {
    /** @param {CONTROL_TYPE_KEYS | CONTROL_TYPE_DUMMY | CONTROL_TYPE_AI } controlType */
    constructor(controlType) {
        this.forward = false;
        this.reverse = false;
        this.left = false;
        this.right = false;

        switch (controlType) {
            case CONTROL_TYPE_KEYS:
            case CONTROL_TYPE_AI:
                this.#addKeyboardListeners();
                break;
            case CONTROL_TYPE_DUMMY:
                this.forward = true;
                break;
        }
    }

    #addKeyboardListeners() {
        const mapping = [
            {
                eventKeysLowerCased: ['w', 'arrowup'],
                controlKey: 'forward'
            },
            {
                eventKeysLowerCased: ['s', 'arrowdown'],
                controlKey: 'reverse'
            },
            {
                eventKeysLowerCased: ['a', 'arrowleft'],
                controlKey: 'left'
            },
            {
                eventKeysLowerCased: ['d', 'arrowright'],
                controlKey: 'right'
            },
        ]

        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();

            const found = mapping.find(m => m.eventKeysLowerCased.includes(key));
            if (!found) {
                return;
            }

            this[found.controlKey] = true;
        })

        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();

            const found = mapping.find(m => m.eventKeysLowerCased.includes(key));
            if (!found) {
                return;
            }

            this[found.controlKey] = false;
        })
    }
}

export default Controls;
