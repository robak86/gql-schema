// import {GraphQLString} from "graphql";
// import {CourseSectionNode} from "../lib/admin/courses/schema/CourseSectionNode";
// import {Type} from "../lib/commons/utils/Object";
//
//
// //TODO: add strong typings for [someGraphQlType]|SomeGraphQlType
// function scalarField(...args:any[]):PropertyDecorator {
//     return (target:Object, propertyKey:string | symbol) => {
//
//     }
// }
//
// //TODO: arrayField ?
// function listField<O, I>(outputType:Type<O>, args:I, resolve:(input:I) => O):PropertyDecorator {
//     return (target:Object, propertyKey:string | symbol) => {
//
//     }
// }
//
// function nonNullField(...args:any[]):PropertyDecorator {
//     return (target:Object, propertyKey:string | symbol) => {
//
//     }
// }
//
// // function listField(...args:any[]):PropertyDecorator {
// //     return (target:Object, propertyKey:string | symbol) => {
// //
// //     }
// // }
//
// function fieldParams(...args:any[]):PropertyDecorator {
//     return (target:Object, propertyKey:string | symbol) => {
//
//     }
// }
//
// function ObjectType(...args:any[]):ClassDecorator {
//     return (target) => target
// }
//
//
// class RelatedType {
//
// }
//
// //TODO: sprawdzić czy można nie definiować resolverów w GraphQLObjectType i zostaną one domergowane w resolverach
// //TODO: sprawdzić czy można nie definiować resolverów w GraphQLObjectType i zostaną one domergowane w resolverach
// //TODO: sprawdzić czy można nie definiować resolverów w GraphQLObjectType i zostaną one domergowane w resolverach
// //TODO: sprawdzić czy można nie definiować resolverów w GraphQLObjectType i zostaną one domergowane w resolverach
// //TODO: nie wykorzystamy łatwo tych typów na froncie ponieważ wszystkie property muszą być opcjonalne... z drugiej strony użycie Partial mogłoby być wystarczające
//
//
// //TODO: resolver musi być przekazywany jako param do decorator
// //TODO: zrobić tak, żeby resolver był typesae (Problem! resolver zwróci stringa a oczekujemy GraphQLString; jak zrobić mapowanie scalarów ?)
// // @fieldParams()
// class SomeArguments {
//     @scalarField(GraphQLString) param1:string;
//     @scalarField([GraphQLString]) param2:string[];
// }
//
// @ObjectType()
// class WtfCourse {
//     @scalarField(GraphQLString) firstName:string;
//
//     @listField(RelatedType, SomeArguments, (input:SomeArguments) => 'sdf')
//     sections2:RelatedType[]; //TODO: tutaj nie możemy definiować resolverów!!!!!! Sprawdzić czy to jest możliwe
//
// // @nonNullField([RelatedType], {args: SomeArguments});
// //     sections:RelatedType[]; //TODO: tutaj nie możemy definiować resolverów!!!!!! Sprawdzić czy to jest możliwe
// }
//
//
// describe.only("It should work", () => {
//     it("works", () => {
//         //THIS WORKS!!!
//         console.log(Reflect.getMetadata('design:type', new WtfCourse(), 'firstName'));
//         console.log(Reflect.getMetadata('design:type', WtfCourse.prototype, 'firstName'));
//         // console.log(Reflect.getMetadataKeys(WtfCourse));
//         // console.log(Reflect.getMetadataKeys(WtfCourse.prototype));
//         // console.log(Reflect.getMetadataKeys(new WtfCourse()));
//     });
// });