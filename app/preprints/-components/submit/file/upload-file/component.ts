import { action } from '@ember/object';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import PreprintModel from 'ember-osf-web/models/preprint';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import FileModel from 'ember-osf-web/models/file';

interface PreprintUploadArgs {
    manager: PreprintStateMachine;
    preprint: PreprintModel;
    allowVersioning: boolean;
    validate: (_: FileModel) => {};
    clickableElementId: string;
    dragEnter: () => {};
    dragLeave: () => {};
    dragOver: () => {};
}


export default class PreprintUpload extends Component<PreprintUploadArgs> {
    @service intl!: Intl;
    @service toast!: Toast;

    get clickableElementSelectors() {
        if (this.args.clickableElementId) {
            return [`#${this.args.clickableElementId}`];
        }
        return [];
    }

    get dropzoneOptions() {
        const uploadLimit = 1;
        return {
            createImageThumbnails: false,
            method: 'PUT',
            withCredentials: true,
            preventMultipleFiles: true,
            acceptDirectories: false,
            autoProcessQueue: true,
            autoQueue: true,
            parallelUploads: uploadLimit,
            maxFilesize: 10000000,
            timeout: null,
        };
    }

    @action
    buildUrl(files: any[]): string {
        const { name } = files[0];
        const url = new URL(this.args.preprint.files.firstObject!.links.upload as string);
        url.searchParams.append('kind', 'file');
        url.searchParams.append('name', name);
        return url.toString();
    }

    @action
    async success(_: any, __:any, file: FileModel): Promise<void> {
        const preprint = await this.args.manager.preprint;
        const files = await this.args.manager.preprint.files;
        const osfStorage = await files!.firstObject;
        const primaryFile = await osfStorage!.files;
        this.args.validate(file);
    }
}
