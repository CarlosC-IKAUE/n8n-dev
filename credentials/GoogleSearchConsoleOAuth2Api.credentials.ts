import { ICredentialType, INodeProperties } from 'n8n-workflow';

const scopes = ['https://www.googleapis.com/auth/webmasters'];

export class GoogleSearchConsoleOAuth2Api implements ICredentialType {
	name = 'googleSearchConsoleOAuth2Api';
	extends = ['googleOAuth2Api'];
	displayName = 'Google Search Console OAuth2 API';
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