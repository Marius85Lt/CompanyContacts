import * as React from 'react';
import styles from './SharepointCandidates.module.scss';
import { ISharepointCandidatesProps } from './ISharepointCandidatesProps';
import { TextField, } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import pnp from 'sp-pnp-js';
import { IContactList, ISContacList } from '../../../services/service.interface';
import { Chart } from './Chart';
import { List } from './List';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

export interface ISharepointCandidatesState {
  contacts?: IContactList[];
  companies?: ISContacList[];
  selectedCompany?: IDropdownOption;
  firstName?: string;
  lastName?: string;
  email?: string;
  salary?: string;
  loading?: boolean;
}

export default class SharepointCandidates extends React.Component<ISharepointCandidatesProps, ISharepointCandidatesState> {
  private contactsListName = "1be952178267464081093b559f3bff93";
  private companiesListName = "Company";
  private initialState = {
    contacts: [],
    companies: [],
    selectedCompany: null,
    firstName: "",
    lastName: "",
    email: "",
    salary: "",
    loading: true
  };

  constructor(props) {
    super(props);
    pnp.setup({
      spfxContext: this.props.context
    });
    this.state = this.initialState;
    this.saveClicked = this.saveClicked.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  private getData(): void {
    Promise.all([
      pnp.sp.web.lists.getByTitle(this.contactsListName).items.get()
        .then((items: IContactList[]) => {
          this.setState({
            contacts: items
          });
        }),
      pnp.sp.web.lists.getByTitle(this.companiesListName).items.get()
        .then((items: ISContacList[]) => {
          this.setState({
            companies: items,
            selectedCompany: this.getInitialCompany(items)
          });
        })
    ]).then(() => {
      this.setState({
        loading: false
      });
    });
  }

  private getInitialCompany(cpmpanies: ISContacList[]) {
    return cpmpanies.length == 0 ? null : { key: 0, text: cpmpanies[0].CompanyName }
  }

  private saveClicked(): void {
    this.setState({
      loading: true
    });
    pnp.sp.web.lists.getByTitle(this.contactsListName).items.add({
      FirstName: this.state.firstName,
      Title: this.state.lastName,
      Email: this.state.email,
      Company: this.state.selectedCompany.text,
      Salary: this.state.salary
    }).then(r => {
      this.setState(this.initialState);
      this.getData();
    });
  }

  private validateRequired(value: string): boolean {
    return value != null && value != "";
  }

  private validateEmail(value: string): string {
    return !this.validateRequired(value) || value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? null : "Please enter a valid email";
  }

  private validateNumber(value: string): string {
    return !this.validateRequired(value) || !isNaN(Number(value)) ? null : "Please enter a number";
  }

  private formIsValid(): boolean {
    return this.validateRequired(this.state.firstName) &&
      this.validateRequired(this.state.lastName) &&
      this.validateRequired(this.state.email) &&
      this.validateRequired(this.state.salary) &&
      this.validateEmail(this.state.email) == null &&
      this.validateNumber(this.state.salary) == null
  }

  public render(): React.ReactElement<ISharepointCandidatesProps> {
    let ddCompanyOptions = this.state.companies == null ? [] :
      this.state.companies.map((item: ISContacList, index) => ({ key: index, text: item.CompanyName }));

    return (
      <div className={styles.sharepointCandidates}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Form validation</span>
              <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
              <TextField label="User first name:"
                value={this.state.firstName}
                onChanged={(value) => this.setState({ firstName: value })}
                required={true} />
              <TextField label="User last name:"
                required={true}
                value={this.state.lastName}
                onChanged={(value) => this.setState({ lastName: value })} />
              <TextField label="User email:"
                errorMessage={this.validateEmail(this.state.email)}
                required={true}
                value={this.state.email}
                onChanged={(value) => this.setState({ email: value })} />
              <Dropdown label="User company:"
                selectedKey={this.state.selectedCompany == null ? 0 : this.state.selectedCompany.key}
                onChanged={(option: IDropdownOption) => this.setState({ selectedCompany: option })}
                options={ddCompanyOptions}
              />
              <TextField
                label="User salary:"
                errorMessage={this.validateNumber(this.state.salary)}
                required={true}
                value={this.state.salary}
                onChanged={(value) => this.setState({ salary: value })} />
              {!this.state.loading ?
                <PrimaryButton text="Save"
                  onClick={this.saveClicked} disabled={!this.formIsValid()} /> :
                <Spinner size={SpinnerSize.large} />}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <Chart contacts={this.state.contacts} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.columnWide}>
              <List contacts={this.state.contacts} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
