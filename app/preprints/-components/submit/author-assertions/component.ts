import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import { tracked } from '@glimmer/tracking';
import { PreprintDataLinksEnum } from 'ember-osf-web/models/preprint';


/**
 * The Author Assertions Args
 */
interface AuthorAssertionsArgs {
    manager: PreprintStateMachine;
}

interface AuthorAssertionsForm {
    hasCoi: boolean;
    conflictOfInterestStatement: string;
    hasDataLinks: string;
    whyNoData: string;
    dataLinks: string[];
}

const AuthorAssertionsFormValidation: ValidationObject<AuthorAssertionsForm> = {
    hasCoi: validatePresence({
        presence: true,
        ignoreBlank: true,
        type: 'empty',
    }),
    conflictOfInterestStatement: validatePresence({
        presence: true,
        ignoreBlank: true,
        type: 'empty',
    }),
    hasDataLinks: validatePresence({
        presence: true,
        ignoreBlank: true,
        type: 'empty',
    }),
    whyNoData: [(key: string, newValue: string[], oldValue: string[], changes: any, content: any) => {
        if (changes['hasDataLinks']) {
            if (changes['hasDataLinks'] !== PreprintDataLinksEnum.YES) {
                return validatePresence({
                    presence: true,
                    ignoreBlank: true,
                    type: 'empty',
                })(key, newValue, oldValue, changes, content);
            }
            return true;
        } else {
            return false;
        }
    }],
    dataLinks: [(key: string, _newValue: string[], _oldValue: string[], changes: any, _content: any) => {
        if (changes['hasDataLinks']) {
            if (changes['hasDataLinks'] === PreprintDataLinksEnum.YES) {
                return changes[key]?.length > 0;
            }
            return true;
        } else {
            return false;
        }
    }],
};

/**
 * The Author Assertions Component
 */
export default class PublicData extends Component<AuthorAssertionsArgs>{
    @service intl!: Intl;
    @tracked isConflictOfInterestStatementDisabled = true;
    @tracked isPublicDataStatementDisabled = true;
    authorAssertionFormChangeset = buildChangeset(
        this.args.manager.preprint,
        AuthorAssertionsFormValidation,
    );

    coiOptionBlockValues = [
        {
            registrationResponseKey: 'hasCoi',
            inputValue: true,
            displayText: this.intl.t('general.yes'),
        } as SchemaBlock,
        {
            registrationResponseKey: 'hasCoi',
            inputValue: false,
            displayText: this.intl.t('general.no'),
        } as SchemaBlock,
    ];

    public get displayCoiStatement(): boolean {
        return this.authorAssertionFormChangeset.get('hasCoi') !== undefined;
    }

    @action
    public async updateCoi(): Promise<void> {
        if (this.authorAssertionFormChangeset.get('hasCoi')) {
            await this.authorAssertionFormChangeset.set('conflictOfInterestStatement', '');
            this.isConflictOfInterestStatementDisabled = false;
        } else {
            this.isConflictOfInterestStatementDisabled = true;
            await this.authorAssertionFormChangeset.set('conflictOfInterestStatement',
                this.intl.t('preprints.submit.step-three.conflict-of-interest-none'));
        }

        this.validate();
    }

    @action
    public validate(): void {
        this.authorAssertionFormChangeset.validate();
        if (this.authorAssertionFormChangeset.isInvalid) {
            this.args.manager.validateAuthorAssertions(false);
            return;
        }
        this.authorAssertionFormChangeset.execute();
        this.args.manager.validateAuthorAssertions(true);
    }
}
