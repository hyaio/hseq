describe("Note test", function() {
    it("creates a Note", function() {
        var note = new Note();
        expect(note).toBeDefined();
    });
    it("sets a Note start", function() {
        var note = new Note();
        note.setStart (1.34);
        expect(note.start).toEqual(1.34);
    });
    it("sets a Note duration", function() {
        var note = new Note();
        note.setDuration (3.5);
        expect(note.duration).toEqual(3.5);
    });
    it("sets a Note number", function() {
        var note = new Note();
        note.setNumber (67);
        expect(note.number).toEqual(67);
    });
});

describe("Strip test", function() {
    it("creates a Strip", function() {
        var strip = new Strip();
        expect(strip).toBeDefined();
    });
    it("adds / gets a Note to / from the strip", function() {
        var strip = new Strip();
        var id = strip.addNote(0.5, 1.5, 88);
        var note = strip.getNote(id);
        expect(note.start).toEqual(0.5);
        expect(note.duration).toEqual(1.5);
        expect(note.number).toEqual(88);
    });
    // TODO
});

