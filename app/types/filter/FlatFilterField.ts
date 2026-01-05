export enum FlatFilterField {
    ID = "id",
    NAME = "name",
    COORDINATES_ID = "coordinates.id",
    COORDINATES_X = "coordinates.x",
    COORDINATES_Y = "coordinates.y",
    CREATION_DATE = "creationDate",
    AREA = "area",
    NUMBER_OF_ROOMS = "numberOfRooms",
    HEIGHT = "height",
    VIEW = "view",
    TRANSPORT = "transport",
    HOUSE_ID = "house.id",
    HOUSE_NAME = "house.name",
    HOUSE_YEAR = "house.year",
    HOUSE_NUMBER_OF_FLATS_ON_FLOOR = "house.numberOfFlatsOnFloor",
    PRICE = "price",
    BALCONY_TYPE = "balconyType",
    WALKING_MINUTES_TO_METRO = "walkingMinutesToMetro",
    TRANSPORT_MINUTES_TO_METRO = "transportMinutesToMetro",
}

export const FlatFilterFieldDictionary: Record<string, string> = {
    [FlatFilterField.ID]: "id",
    [FlatFilterField.NAME]: "name",
    [FlatFilterField.COORDINATES_ID]: "coordinates id",
    [FlatFilterField.COORDINATES_X]: "coordinates x",
    [FlatFilterField.COORDINATES_Y]: "coordinates y",
    [FlatFilterField.CREATION_DATE]: "creationDate",
    [FlatFilterField.AREA]: "area",
    [FlatFilterField.NUMBER_OF_ROOMS]: "number of rooms",
    [FlatFilterField.HEIGHT]: "height",
    [FlatFilterField.VIEW]: "view",
    [FlatFilterField.TRANSPORT]: "transport",
    [FlatFilterField.HOUSE_ID]: "house id",
    [FlatFilterField.HOUSE_NAME]: "house name",
    [FlatFilterField.HOUSE_YEAR]: "house year",
    [FlatFilterField.HOUSE_NUMBER_OF_FLATS_ON_FLOOR]: "house number of flats on floor",
    [FlatFilterField.PRICE]: "price",
    [FlatFilterField.BALCONY_TYPE]: "balcony type",
    [FlatFilterField.WALKING_MINUTES_TO_METRO]: "walking minutes to metro",
    [FlatFilterField.TRANSPORT_MINUTES_TO_METRO]: "transport minutes to metro",
};

export const FlatFilterFieldIntegerSet = new Set<string>([
    FlatFilterField.ID,
    FlatFilterField.COORDINATES_ID,
    FlatFilterField.COORDINATES_Y,
    FlatFilterField.AREA,
    FlatFilterField.NUMBER_OF_ROOMS,
    FlatFilterField.HEIGHT,
    FlatFilterField.HOUSE_ID,
    FlatFilterField.HOUSE_YEAR,
    FlatFilterField.HOUSE_NUMBER_OF_FLATS_ON_FLOOR,
    FlatFilterField.WALKING_MINUTES_TO_METRO,
    FlatFilterField.TRANSPORT_MINUTES_TO_METRO,
]);

export const FlatFilterFieldFloatSet = new Set<string>([
    FlatFilterField.COORDINATES_X,
    FlatFilterField.PRICE,
]);

export const FlatFilterFieldStringSet = new Set<string>([
    FlatFilterField.NAME,
    FlatFilterField.CREATION_DATE,
    FlatFilterField.HOUSE_NAME,
]);
