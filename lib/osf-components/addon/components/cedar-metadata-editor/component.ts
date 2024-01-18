import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import config from 'ember-osf-web/config/environment';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';
import AbstractNodeModel from 'ember-osf-web/models/abstract-node';
import FileModel from 'ember-osf-web/models/file';
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';
import RouterService from '@ember/routing/router-service';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import { action } from '@ember/object';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import captureException from 'ember-osf-web/utils/capture-exception';

const { cedarConfig } = config;

interface Args {
    cedarMetadataRecord?: CedarMetadataRecordModel;
    cedarMetadataTemplate: CedarMetadataTemplateModel;
    target: AbstractNodeModel | FileModel;
    displayArtifactViewer?: () => {};
}

export default class CedarMetadataEditor extends Component<Args> {
    @service toast!: Toast;
    @service intl!: Intl;
    @service store!: Store;
    @service router!: RouterService;

    cedarConfig = cedarConfig.editorConfig;
    isEdit = this.args.cedarMetadataRecord ? true : false;

    @action
    addMetadata(): void {
        if (this.args.cedarMetadataRecord) {
            const cee = document.querySelector('cedar-embeddable-editor');
            // eslint-disable-next-line
            // @ts-ignore
            cee.instanceObject = this.args.cedarMetadataRecord.metadata;
        }
    }

    @action
    cancel() {
        if (this.args.displayArtifactViewer) {
            this.args.displayArtifactViewer();
        }
    }

    @task
    @waitFor
    async save() {
        const cee = document.querySelector('cedar-embeddable-editor');
        let record: CedarMetadataRecordModel;
        if (this.isEdit) {
            record = this.args.cedarMetadataRecord || {} as CedarMetadataRecordModel;
        } else {
            record = this.store.createRecord('cedar-metadata-record');
            record.template = this.args.cedarMetadataTemplate;
            record.target = this.args.target;
        }

        // eslint-disable-next-line
        // @ts-ignore
        record.metadata = cee.currentMetadata;
        await record.save().then(() => {
            // eslint-disable-next-line max-len, @typescript-eslint/no-unused-expressions
            this.isEdit ?  this.args.displayArtifactViewer() : this.router.transitionTo('guid-node.metadata.detail', record.id);
        }).catch((error: Error) => {
            captureException(error);
            this.toast.error(this.intl.t('cedar.editor.error'));
        });


    }
}
