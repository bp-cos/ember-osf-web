import Component from '@glimmer/component';
import { action, notifyPropertyChange } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { tracked } from '@glimmer/tracking';


/**
 * The Data Link Widget Args
 */
interface DataLinkWidgetArgs {
    update: (_: string[]) => {};
}

/**
 * The Data Link Widget Component
 */
export default class DataLinkWidget extends Component<DataLinkWidgetArgs>{
    @service intl!: Intl;
    @tracked links: string[] = [''];

    @action
    public async onUpdate(value: string, index: number): Promise<void> {
        this.links[index] = value;
        await this.args.update(this.links);
        notifyPropertyChange(this, 'links');
    }

    @action
    public async addLink(): Promise<void> {
        this.links.push('');
        notifyPropertyChange(this, 'links');
    }

    @action
    public async removeLink(index: number): Promise<void> {
        if (index === 0 && this.links.length === 1) {
            this.onUpdate('', index);
        } else {
            this.links.splice(index, 1);
            await this.args.update(this.links);
            notifyPropertyChange(this, 'links');
        }
    }
}
