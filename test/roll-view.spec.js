// Polyfills for PhantomJS

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };
}

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

describe("RollView test", function() {
    it("creates a RollView", function() {
        var strip = new Strip();
        var canvas = document.createElement("canvas");
        var rv = new RollView(canvas, strip);
        expect(rv).toBeDefined();
    });
    it("creates a RollView and gets the state", function() {
        var strip = new Strip();
        strip.addNote(0.5, 1.5, 88);
        strip.addNote(0.15, 1, 91);
        strip.addNote(2.5, 1.89, 22);
        strip.addNote(6.32, 2, 44);
        strip.addNote(11, 20, 56);
        strip.addNote(3.75, 5.6, 23);
        var canvas = document.createElement("canvas");
        var rv = new RollView(canvas, strip);
        var state = rv.getState();
        expect(state).toBeDefined();
    });
});