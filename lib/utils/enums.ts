export function mapEnumToEnumTypeValues(enumType) {
    let values = {};
    Object.keys(enumType).forEach((key) => {
        values[key] = {value: enumType[key]}
    });

    return values;
}