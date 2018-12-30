import { attr } from '@ember-decorators/data';

import OsfModel from './osf-model';

// TODO: API often represents subjects as SubjectRefs. Someday, when the API
// improves, it should be a relationship field.
export interface SubjectRef {
    id: string;
    text: string;
}

/**
 * Model for OSF APIv2 preprints. This model may be used with one of several API
 * endpoints. It may be queried directly. In the future, there will be multiple
 * taxonomy endpoints under the same namespace.
 */
export default class TaxonomyModel extends OsfModel {
    @attr('fixstring') text!: string;
    @attr('string') shareTitle!: string;
    @attr('string') path!: string;
    @attr('number') childCount!: number;
    @attr('object') parent!: SubjectRef;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        taxonomy: TaxonomyModel;
    } // eslint-disable-line semi
}
