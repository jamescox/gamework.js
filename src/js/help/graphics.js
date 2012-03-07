gamework.help.data.push({
  'title': 'Graphics',
  'name':  'graphics',
  
  'sections': [
    {
      'title': 'Layer Managment',
      
      'definitions': [
        {
          'name': 'currentlayer',
          
          'type': 'property',
          
          'property_types': ['string'],
          
          'description': 'Get and sets the name of the currently active layer.'
        },
        {
          'name': 'alllayers',
          
          'type': 'property',
          
          'property_types': ['array&lt;string&gt;'],
          
          'description': 'Gets a list of all the layers in the screen.'
        },
        {
          'name': 'newlayer',
          
          'type': 'function',
          
          'call_signatures': [
            'newlayer(name)',
            'newlayer(name, abovebelow)'
          ],
          
          'description': 'Creates a new layer on the screen.  The current layer is switched to the newly created layer on success.',
          
          'args': [
            { 
              'name': 'name', 
              'types': ['string'],
              
              'description': 'the name of the new layer to be created.  Layer names must be a valid JavaScript identifier.' 
            },
            { 
              'name': 'abovebelow',
              'types': ['string'],
              
              'description': "a string with the value <code>'above'</code> or <code>'below'</code>, tells the layer manager where to place the new layer relative to the current layer.  Defualt value is <code>'above'</code>."
            }
          ],
          
          'returns': {
            'types': ['string'],
            'description': "the name of newly created layer, or <code>''</code> if there was an error."
          }
        }
      ]
    }
  ]
});

