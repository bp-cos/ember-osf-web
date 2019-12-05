import Route from '@ember/routing/route';

import { DefaultPage } from 'ember-osf-web/utils/page-param';

export default class DraftIndexRoute extends Route {
    beforeModel() {
        const params: { id?: string } = this.paramsFor('drafts.draft');
        return this.replaceWith('drafts.draft.page', params.id, DefaultPage);
    }
}
