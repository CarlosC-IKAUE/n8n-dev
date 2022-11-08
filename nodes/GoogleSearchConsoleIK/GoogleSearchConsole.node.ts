import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	INodeCredentialTestResult,
	NodeOperationError,
} from 'n8n-workflow';
import { OptionsWithUri } from 'request';

import { googleApiRequest } from './GenericFunctions';

export class GoogleSearchConsole implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Search Console ',
		name: 'googleSearchConsole',
		icon: 'file:googleSearchConsole.svg',
		group: ['input', 'output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get stuff from google search console',
		defaults: {
			name: 'Google Search Console',
			color: '#0aa55c',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'googleApi',
				required: true,
				displayOptions: {
					show: {
						authentication: [
							'serviceAccount',
						],
					},
				},
				testedBy: 'googleApiCredentialTest',
			},
			{
				name: 'googleSearchConsoleOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: [
							'oAuth2',
						],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Service Account',
						value: 'serviceAccount',
					},
					{
						name: 'OAuth2',
						value: 'oAuth2',
					},
				],
				default: 'serviceAccount',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Search Analytics',
						value: 'searchAnalytics',
					},
					{
						name: 'Sitemaps',
						value: 'sitemaps',
					},

				],
				default: 'searchAnalytics',
				description: 'The resource to perform operation on.',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'searchAnalytics',
						],
					},
				},
				options: [
					{
						name: 'Post',
						value: 'post',
						description: 'Post query',
					},
				],
				default: 'post',
				description: 'The operation to perform.',
			},

			// ----------------------------------
			//         All
			// ----------------------------------
			{
				displayName: 'Site URL',
				name: 'siteUrl',
				type: 'string',
				displayOptions: {
					show: {
						resource: [
							'searchAnalytics',
						],
					},
				},
				default: '',
				required: true,
				description: 'The site URL (e.g. https://blog.ikhuerta.com/)',
			},
			{
				displayName: 'Start date',
				name: 'startDate',
				type: 'string',
				displayOptions: {
					show: {
						resource: [
							'searchAnalytics',
						],
					},
				},
				default: '',
				required: true,
				description: 'Start date of the extraction (YYYY-MM-DD format)',
			},
			{
				displayName: 'End date',
				name: 'endDate',
				type: 'string',
				displayOptions: {
					show: {
						resource: [
							'searchAnalytics',
						],
					},
				},
				default: '',
				required: true,
				description: 'End date of the extraction (YYYY-MM-DD format)',
			},
		],
	};

	

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		if (resource === 'searchAnalytics') {
			if (operation === 'post') {
				// get email input
				const url = this.getNodeParameter('siteUrl', 0) as string;
				const startDate = this.getNodeParameter('startDate', 0) as string;
				const endDate = this.getNodeParameter('endDate', 0) as string;
				// get additional fields input
				// const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;
				const additionalFields = {
					startDate: startDate,
					endDate: endDate,
					dimensions: 'page'
				}
				const data: IDataObject = {};

				Object.assign(data, additionalFields);

				responseData = await googleApiRequest.call(this, 'POST', encodeURIComponent(url), data);
			}
		}

		// Map data to n8n data
		return [this.helpers.returnJsonArray(responseData)];
	}
}