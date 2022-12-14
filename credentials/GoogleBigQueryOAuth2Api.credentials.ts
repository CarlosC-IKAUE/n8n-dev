import { ICredentialType, INodeProperties } from 'n8n-workflow';

const scopes = ['https://www.googleapis.com/auth/bigquery'];

export class GoogleBigQueryOAuth2Api implements ICredentialType {
	name = 'googleBigQueryOAuth2Api';
	extends = ['googleOAuth2Api'];
	displayName = 'Google BigQuery OAuth2 API';
	documentationUrl = 'https://developers.google.com/identity/protocols/oauth2';
	properties: INodeProperties[] = [
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: scopes.join(' '),
		},
	];
}
