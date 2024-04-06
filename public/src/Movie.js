class Movie {
    constructor(id, title, director, year, notes) {
        this.id = id;
        this.title = title;
        this.director = director;
        this.year = year;
        this.notes = notes || ''; // Default to an empty string if notes are not provided
    }
}

module.exports = Movie;