import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import PreprintModel from 'ember-osf-web/models/preprint';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class PreprintSerializer extends ApplicationSerializer<PreprintModel> {
    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/${model.id}/`,
        };
    }

    buildRelationships(model: ModelInstance<PreprintModel>) {
        const relationships: SerializedRelationships<PreprintModel> = {
            provider: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/preprints/${model.provider.id}`,
                        meta: {},
                    },
                },
            },
            /*
            subjects: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/preprints/${model.id}/subjects/`,
                        meta: this.buildRelatedLinkMeta(model, 'subjects'),
                    },
                },
            },
            highlightedSubjects: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/preprints/${model.id}/subjects/highlighted/`,
                        meta: {
                            has_highlighted_subjects,
                        },
                    },
                },
            },
            licensesAcceptable: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/preprints/${model.id}/licenses/`,
                        meta: {},
                    },
                },
            },
            moderators: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/preprints/${model.id}/moderators/`,
                        meta: this.buildRelatedLinkMeta(model, 'moderators'),
                    },
                },
            },
            preprints: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/preprints/${model.id}/preprints/`,
                        meta: {},
                    },
                },
            },
            // TODO: subscriptions when we move ember-osf-reviews¥
        */
        };

        /*
        if (model.brand) {
            relationships.brand = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/brands/${model.brand.id}/`,
                        meta: {},
                    },
                },
            };
        }
        */

        return relationships;
    }
}