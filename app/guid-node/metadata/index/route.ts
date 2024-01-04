import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';


export default class MetadataRoute extends Route {
    @service store!: Store;
    @service router!: RouterService;

    async model() {
        const guidNode = await this.modelFor('guid-node').taskInstance;

        const templates = await guidNode.queryHasMany('cedarMetadataRecords', {
            'page[size]': 20,
        });

        return {
            guidNode,
            templates,
        };
    }
}