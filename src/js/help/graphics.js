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
          
          'description': "Get and sets the currently active layer using it's name."
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
    },
    {
      'title': 'Sprite Management',
      
      'definitions': [
        {
          'name': 'moveto',
          
          'type': 'function',
          
          'call_signatures': [
            'moveto(position)',
            'moveto(x, y)'
          ],
          
          'description': 'Moves the current sprite to the give location.',
          
          'args': [
            {
              'name': 'position',
              'types': ['vector'],
              
              'description': 'a vector like object specifing the position to move to.'
            },
            {
              'name': 'x',
              'types': ['number'],
              
              'description': 'the x-coordinate of the position to move to.'
            },
            {
              'name': 'y',
              'types': ['number'],
              
              'description': 'the x-coordinate of the position to move to.'
            }
          ],
          
          'returns': {
            'types': ['vector'],
            'description': 'the final location the sprite was moved to.'
          }
        }
      ]
    }
  ]
});

