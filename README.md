# smoke_test
An interactive browser for "categories.json" and "providers.json" end points for the Scientist.com API.

## Installation
Install Node.js on your machine [Install](https://nodejs.org/en/download/)

## Running
The `smoke_test` app requires the CLIENT_ID and CLIENT_SECRET environment variables to be set. You can either set them in your environment and call the app using:

  $ node index
  
Or you can specify them at run time:

  $ CLIENT_ID=abc CLIENT_SECRET=xyz node index
  
## Example Session

```
> node index
[ 'Categories', 'Providers' ]
Scientist.com API> Categories
Browsing: categories
[ 'Consulting',
  'Drug Metabolism and Pharmacokinetics (DMPK)',
  'Pharmacology',
  'Innovation Hub ™',
  'Analytical Laboratory Services',
  'Clinical Research',
  'Non-Human Biospecimen',
  'Cosmetics',
  'Agroscience',
  'Food & Nutrition Science',
  'Marketing',
  'Human Biospecimen',
  'Toxicology',
  'Chemistry',
  'Animal Health',
  'HEOR & RWE',
  'Data Sciences',
  'Biology' ]

Scientist.com API> Consulting
Browsing: categories
[ 'Clinical Consulting',
  'Pre-Clinical Consulting',
  'Commercial Consulting',
  'Discovery Consulting' ]

Scientist.com API> up
Browsing: categories
[ 'Consulting',
  'Drug Metabolism and Pharmacokinetics (DMPK)',
  'Pharmacology',
  'Innovation Hub ™',
  'Analytical Laboratory Services',
  'Clinical Research',
  'Non-Human Biospecimen',
  'Cosmetics',
  'Agroscience',
  'Food & Nutrition Science',
  'Marketing',
  'Human Biospecimen',
  'Toxicology',
  'Chemistry',
  'Animal Health',
  'HEOR & RWE',
  'Data Sciences',
  'Biology' ]
```
### Notes
From a `Category` or `Provider` list navigate by typing one of the supplied elements from the list.

Return to the higher level by typing `up` at the prompt.

For paged results such as `Provider` the browser shows the next 10 results. Get more results by typing `more` at the prompt.


