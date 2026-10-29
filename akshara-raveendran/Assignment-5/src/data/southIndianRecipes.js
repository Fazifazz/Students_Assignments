// Every curated dish uses an image stored in public/images.
const IMAGE_BY_ID = {
  'si-chicken-curry': '/images/kerala-chicken-curry.jpg',
  'si-chicken-roast': '/images/chicken-roast.jpg',
  'si-tandoori-chicken': '/images/tandoori-chicken.jpg',
  'si-chicken-65': '/images/chicken-65.jpg',
  'si-chicken-handi': '/images/chicken-handi.jpg',
  'si-chicken-lollipop': '/images/chicken-lollipop.jpg',
  'si-karimeen-mappas': '/images/karimeen-mappas.jpg',
  'si-karimeen-pollichathu': '/images/karimeen-pollichathu.jpg',
  'si-prawn-curry': '/images/prawns-curry.jpg',
  'si-prawn-roast': '/images/prawns-roast.jpg',
  'si-kallumakkaya': '/images/kallumakkaya-roast.jpg',
  'si-fish-molee': '/images/fish-molee.jpg',
  'si-veg-kuruma': '/images/vegetable-kuruma.jpg',
  'si-gobi-manchurian': '/images/gobi-manchurian.jpg',
  'si-chilli-gobi': '/images/chilli-gobi.jpg',
  'si-avial': '/images/kerala-avial.jpg',
  'si-sambar': '/images/sambar.jpg',
  'si-masala-dosa': '/images/masala-dosa.jpg',
};

export function getLocalImageForRecipe(recipe = {}) {
  const name = `${recipe.strMeal || ''} ${recipe.strCategory || ''}`.toLowerCase();
  if (name.includes('tandoori')) return '/images/tandoori-chicken.jpg';
  if (name.includes('chicken 65')) return '/images/chicken-65.jpg';
  if (name.includes('chicken')) return '/images/kerala-chicken-curry.jpg';
  if (name.includes('prawn') || name.includes('shrimp')) return '/images/prawns-curry.jpg';
  if (name.includes('mussel')) return '/images/kallumakkaya-roast.jpg';
  if (name.includes('fish') || name.includes('salmon') || name.includes('tuna') || name.includes('seafood')) return '/images/fish-molee.jpg';
  if (name.includes('cauliflower') || name.includes('gobi')) return '/images/gobi-manchurian.jpg';
  if (name.includes('vegetarian') || name.includes('vegan') || name.includes('vegetable')) return '/images/vegetable-kuruma.jpg';
  if (name.includes('pasta') || name.includes('rice')) return '/images/masala-dosa.jpg';
  return '/images/kerala-chicken-curry.jpg';
}

function makeRecipe({ id, name, category, area = 'South Indian', description, ingredients, instructions, tags = [] }) {
  const recipe = {
    idMeal: id,
    strMeal: name,
    strMealThumb: IMAGE_BY_ID[id] || '/images/kerala-chicken-curry.jpg',
    strCategory: category,
    strArea: area,
    strInstructions: instructions.join('\n\n'),
    strTags: tags.join(','),
    strSource: '',
    strYoutube: '',
    strDescription: description,
  };
  ingredients.forEach(([ingredient, measure], index) => {
    recipe[`strIngredient${index + 1}`] = ingredient;
    recipe[`strMeasure${index + 1}`] = measure;
  });
  return recipe;
}

export const southIndianRecipes = [
  makeRecipe({ id: 'si-chicken-curry', name: 'Kerala Chicken Curry', category: 'Chicken', description: 'A homestyle Kerala chicken curry with roasted spices, curry leaves and coconut milk.', tags: ['Kerala', 'spicy', 'coconut'], ingredients: [['Chicken', '500 g'], ['Onion', '2, sliced'], ['Tomato', '1, chopped'], ['Ginger-garlic paste', '1 tbsp'], ['Chilli powder', '1 tsp'], ['Coriander powder', '2 tsp'], ['Garam masala', '1/2 tsp'], ['Coconut milk', '1 cup'], ['Curry leaves', '2 sprigs'], ['Coconut oil', '2 tbsp'], ['Salt', 'to taste']], instructions: ['Heat coconut oil in a heavy pan. Add curry leaves and sliced onion; sauté until golden.', 'Add ginger-garlic paste and tomato. Cook until the tomato softens.', 'Stir in chilli powder, coriander powder and garam masala.', 'Add chicken and salt. Mix well, cover and cook until the chicken is tender.', 'Pour in coconut milk and simmer gently for 5–7 minutes. Serve hot with appam, rice or parotta.'] }),
  makeRecipe({ id: 'si-chicken-roast', name: 'Kerala Chicken Roast', category: 'Chicken', description: 'A deeply spiced, slow-roasted chicken dish with caramelised onions.', tags: ['Kerala', 'roast'], ingredients: [['Chicken', '500 g'], ['Onion', '3, sliced'], ['Ginger-garlic paste', '1 tbsp'], ['Black pepper', '1 tsp'], ['Chilli powder', '1 tsp'], ['Coriander powder', '2 tsp'], ['Fennel powder', '1/2 tsp'], ['Curry leaves', '2 sprigs'], ['Coconut oil', '3 tbsp'], ['Salt', 'to taste']], instructions: ['Marinate chicken with chilli, coriander, pepper, ginger-garlic paste and salt for 20 minutes.', 'Heat coconut oil; sauté onion and curry leaves until dark golden.', 'Add the marinated chicken and cook covered until tender, stirring occasionally.', 'Remove the lid and roast on low heat until the masala clings to the chicken and the edges turn dark.', 'Finish with fresh curry leaves and serve with rice, chapati or parotta.'] }),
  makeRecipe({ id: 'si-tandoori-chicken', name: 'Tandoori Chicken', category: 'Chicken', area: 'North Indian', description: 'Yoghurt-marinated chicken with smoky spices and a bright squeeze of lemon.', tags: ['tandoori', 'grilled'], ingredients: [['Chicken pieces', '700 g'], ['Thick yoghurt', '1/2 cup'], ['Lemon juice', '1 tbsp'], ['Ginger-garlic paste', '1 tbsp'], ['Kashmiri chilli powder', '2 tsp'], ['Turmeric', '1/4 tsp'], ['Garam masala', '1 tsp'], ['Cumin powder', '1 tsp'], ['Oil', '1 tbsp'], ['Salt', 'to taste']], instructions: ['Make deep cuts in the chicken so the marinade can reach inside.', 'Mix yoghurt, lemon juice, ginger-garlic paste, spices, oil and salt.', 'Coat chicken well and refrigerate for at least 2 hours.', 'Bake or air-fry at 200°C until cooked through, turning once and basting with oil.', 'Char briefly under a grill or on a hot pan for smoky edges. Serve with onion and lemon.'] }),
  makeRecipe({ id: 'si-chicken-65', name: 'Chicken 65', category: 'Chicken', area: 'Tamil Nadu', description: 'Crispy, chilli-forward bites tossed with curry leaves.', tags: ['crispy', 'starter'], ingredients: [['Boneless chicken', '500 g'], ['Cornflour', '2 tbsp'], ['Rice flour', '1 tbsp'], ['Ginger-garlic paste', '1 tbsp'], ['Chilli powder', '1 tsp'], ['Yoghurt', '2 tbsp'], ['Lemon juice', '1 tsp'], ['Curry leaves', '2 sprigs'], ['Oil', 'for frying'], ['Salt', 'to taste']], instructions: ['Cut chicken into bite-size pieces and mix with ginger-garlic paste, chilli powder, yoghurt, lemon and salt.', 'Add cornflour and rice flour; mix until each piece is coated.', 'Fry in batches until golden and fully cooked.', 'In a small pan, briefly sizzle curry leaves and a pinch of chilli powder.', 'Toss the fried chicken through the curry leaves and serve immediately.'] }),
  makeRecipe({id:'si-chicken-handi',name:'Chicken Handi',category:'Chicken',area:'North Indian',description:'Creamy,rich chicken curry cooked with aromatic spices,tomatoes and yogurt.',tags:['chicken','curry','creamy'],ingredients:[['Chicken','500 g'],  ['Onion', '2, finely chopped'],['Tomato', '2, chopped'],['Ginger-garlic paste','1 tbsp'],['Yoghurt', '1/2 cup'], ['Fresh cream', '1/4 cup'], ['Chilli powder', '1 tsp'], ['Coriander powder', '2 tsp'],  ['Garam masala', '1 tsp'], ['Oil', '2 tbsp'], ['Salt', 'to taste']],instructions: ['Heat oil in a heavy pan and sauté the onions until golden.','Add ginger-garlic paste and tomatoes. Cook until soft.','Mix in chilli powder, coriander powder and garam masala.','Add the chicken and salt. Cook until lightly browned.','Lower the heat and stir in whisked yoghurt. Cover and cook until the chicken is tender.','Add fresh cream, simmer gently for a few minutes and serve hot.'],}),
  makeRecipe({id: 'si-chicken-lollipop',name: 'Chicken Lollipop',category: 'Chicken',area: 'Indo-Chinese',description: 'Crispy, spicy chicken drumettes coated in a flavourful Indo-Chinese marinade.',tags: ['chicken', 'starter', 'crispy'],ingredients: [['Chicken lollipops', '500 g'],['Ginger-garlic paste', '1 tbsp'],['Cornflour', '3 tbsp'],['Plain flour', '2 tbsp'],['Kashmiri chilli powder', '1 tsp'],['Soy sauce', '1 tbsp'],['Lemon juice', '1 tsp'],['Egg', '1'],['Oil', 'for frying'],['Salt', 'to taste'],],instructions: ['Prepare the chicken lollipops and pat them dry.','Mix ginger-garlic paste, chilli powder, soy sauce, lemon juice, egg, cornflour, plain flour and salt.','Coat the chicken pieces thoroughly and marinate for at least 30 minutes in the refrigerator.','Deep-fry in batches until golden and fully cooked, or cook using a suitable oven or air-fryer method.','Drain excess oil and serve hot with your favourite dipping sauce.'],}),
  makeRecipe({ id: 'si-karimeen-mappas', name: 'Karimeen Mappas', category: 'Seafood', description: 'Pearl spot fish simmered gently in a fragrant coconut-milk gravy.', tags: ['Kerala', 'fish', 'coconut'], ingredients: [['Karimeen / pearl spot', '2 medium'], ['Onion or shallots', '1 cup'], ['Green chilli', '2, slit'], ['Ginger', '1 tbsp, sliced'], ['Tomato', '1, sliced'], ['Turmeric', '1/4 tsp'], ['Coriander powder', '1 tsp'], ['Thin coconut milk', '1 cup'], ['Thick coconut milk', '1/2 cup'], ['Curry leaves', '2 sprigs'], ['Coconut oil', '2 tbsp'], ['Salt', 'to taste']], instructions: ['Clean the fish and season lightly with salt and turmeric.', 'Heat coconut oil. Sauté ginger, green chilli, onion and curry leaves until soft.', 'Add tomato and coriander powder; cook until fragrant.', 'Pour in thin coconut milk and simmer gently. Add fish and cook until just done.', 'Lower the heat, add thick coconut milk and warm without boiling. Serve with appam or rice.'] }),
  makeRecipe({ id: 'si-karimeen-pollichathu', name: 'Karimeen Pollichathu', category: 'Seafood', description: 'Pearl spot fish coated in a spicy masala and wrapped in banana leaf.', tags: ['Kerala', 'fish', 'banana leaf'], ingredients: [['Karimeen / pearl spot', '2 medium'], ['Shallots', '10, sliced'], ['Tomato', '1, chopped'], ['Ginger-garlic paste', '1 tbsp'], ['Chilli powder', '1 tsp'], ['Pepper powder', '1/2 tsp'], ['Turmeric', '1/4 tsp'], ['Curry leaves', '2 sprigs'], ['Banana leaf', '2 pieces'], ['Coconut oil', '2 tbsp'], ['Salt', 'to taste']], instructions: ['Score the cleaned fish and rub with turmeric, chilli, pepper and salt.', 'Sear the fish lightly in a pan and set aside.', 'Sauté shallots, ginger-garlic paste, tomato and curry leaves in coconut oil to make a thick masala.', 'Spread masala over the fish and wrap each fish in a softened banana leaf.', 'Pan-roast the parcels on low heat, turning carefully, until the fish is cooked and aromatic.'] }),
  makeRecipe({ id: 'si-prawn-curry', name: 'Kerala Prawn Curry', category: 'Seafood', description: 'Prawns in a tangy, spicy coconut gravy with curry leaves.', tags: ['Kerala', 'prawns', 'coconut'], ingredients: [['Prawns, cleaned', '400 g'], ['Shallots', '8'], ['Tomato', '1'], ['Kudampuli / tamarind', '1 small piece'], ['Chilli powder', '1 tsp'], ['Coriander powder', '2 tsp'], ['Turmeric', '1/4 tsp'], ['Thin coconut milk', '1 cup'], ['Curry leaves', '2 sprigs'], ['Coconut oil', '2 tbsp'], ['Salt', 'to taste']], instructions: ['Soak kudampuli in warm water if using, and keep aside.', 'Sauté shallots and curry leaves in coconut oil until soft. Add tomato and spices.', 'Add thin coconut milk, kudampuli and salt; simmer for a few minutes.', 'Add prawns and cook gently until pink and just cooked through.', 'Rest for 5 minutes before serving with steamed rice.'] }),
  makeRecipe({ id: 'si-prawn-roast', name: 'Chemmeen Roast (Prawn Roast)', category: 'Seafood', description: 'Juicy prawns roasted with onion, tomato and Kerala spice mix.', tags: ['Kerala', 'prawns', 'roast'], ingredients: [['Prawns, cleaned', '400 g'], ['Onion', '2, sliced'], ['Tomato', '1'], ['Ginger-garlic paste', '1 tbsp'], ['Chilli powder', '1 tsp'], ['Coriander powder', '1 tsp'], ['Black pepper', '1/2 tsp'], ['Curry leaves', '2 sprigs'], ['Coconut oil', '2 tbsp'], ['Salt', 'to taste']], instructions: ['Season prawns with turmeric, pepper and salt.', 'Sauté onion and curry leaves in coconut oil until golden. Add ginger-garlic paste.', 'Add tomato and spice powders; cook into a thick masala.', 'Add prawns and toss over medium heat until cooked.', 'Roast briefly until the masala coats the prawns. Avoid overcooking.'] }),
  makeRecipe({ id: 'si-kallumakkaya', name: 'Kallumakkaya Ularthiyathu', category: 'Seafood', description: 'Kerala mussels stir-roasted with pepper, chilli and curry leaves.', tags: ['Kerala', 'mussels', 'spicy'], ingredients: [['Kallumakkaya / mussels, cleaned', '500 g'], ['Shallots', '10, sliced'], ['Ginger-garlic paste', '1 tbsp'], ['Chilli powder', '1 tsp'], ['Black pepper', '1 tsp'], ['Turmeric', '1/4 tsp'], ['Garam masala', '1/2 tsp'], ['Curry leaves', '2 sprigs'], ['Coconut oil', '2 tbsp'], ['Salt', 'to taste']], instructions: ['Clean the mussels thoroughly and steam until they open; discard any that remain closed.', 'Heat coconut oil and sauté shallots, ginger-garlic paste and curry leaves.', 'Add chilli, pepper, turmeric, garam masala and salt.', 'Add mussels and toss gently until coated in the masala.', 'Roast over low heat for a few minutes and serve hot as a side dish.'] }),
  makeRecipe({ id: 'si-fish-molee', name: 'Kerala Fish Molee', category: 'Seafood', description: 'A mild fish curry in silky coconut milk with green chilli and ginger.', tags: ['Kerala', 'fish', 'mild'], ingredients: [['Firm fish steaks', '500 g'], ['Onion', '1, sliced'], ['Green chilli', '2'], ['Ginger', '1 tbsp'], ['Tomato', '1'], ['Turmeric', '1/4 tsp'], ['Thin coconut milk', '1 cup'], ['Thick coconut milk', '1/2 cup'], ['Curry leaves', '2 sprigs'], ['Coconut oil', '2 tbsp'], ['Salt', 'to taste']], instructions: ['Season fish with a little salt and turmeric.', 'Sauté ginger, green chilli, onion and curry leaves in coconut oil.', 'Add tomato and thin coconut milk. Bring to a gentle simmer.', 'Slide in fish and cook gently until it flakes easily.', 'Add thick coconut milk and warm without boiling. Serve with appam or bread.'] }),
  makeRecipe({ id: 'si-veg-kuruma', name: 'Vegetable Kuruma', category: 'Vegetarian', description: 'Mixed vegetables in a creamy, aromatic coconut and cashew gravy.', tags: ['vegetarian', 'Kerala', 'coconut'], ingredients: [['Mixed vegetables', '3 cups'], ['Onion', '1, chopped'], ['Tomato', '1'], ['Ginger-garlic paste', '1 tsp'], ['Cashews', '8'], ['Grated coconut', '1/2 cup'], ['Fennel seeds', '1/2 tsp'], ['Garam masala', '1/2 tsp'], ['Curry leaves', '1 sprig'], ['Oil', '1 tbsp'], ['Salt', 'to taste']], instructions: ['Cook the mixed vegetables until just tender.', 'Grind coconut, cashews and fennel with a little water into a smooth paste.', 'Sauté onion, ginger-garlic paste and tomato in oil until soft.', 'Add vegetables, ground paste, garam masala, salt and a little water.', 'Simmer until creamy and finish with curry leaves. Serve with chapati, appam or dosa.'] }),
  makeRecipe({ id: 'si-gobi-manchurian', name: 'Gobi Manchurian', category: 'Vegetarian', area: 'Indo-Chinese', description: 'Crispy cauliflower tossed in a tangy, garlicky Indo-Chinese sauce.', tags: ['vegetarian', 'starter', 'Indo-Chinese'], ingredients: [['Cauliflower florets', '3 cups'], ['Cornflour', '4 tbsp'], ['Plain flour', '2 tbsp'], ['Ginger-garlic', '1 tbsp, chopped'], ['Spring onion', '2 tbsp'], ['Soy sauce', '1 tbsp'], ['Tomato ketchup', '2 tbsp'], ['Chilli sauce', '1 tbsp'], ['Vinegar', '1 tsp'], ['Oil', 'for frying'], ['Salt', 'to taste']], instructions: ['Blanch cauliflower florets for 2 minutes and drain well.', 'Make a thick batter with cornflour, plain flour, salt and water; coat the florets.', 'Fry until crisp and golden.', 'Stir-fry ginger, garlic and spring onion. Add soy sauce, ketchup, chilli sauce and vinegar.', 'Toss the crispy cauliflower in the sauce and serve immediately.'] }),
  makeRecipe({ id: 'si-chilli-gobi', name: 'Chilli Gobi', category: 'Vegetarian', area: 'Indo-Chinese', description: 'A spicy, crunchy cauliflower starter with green chilli and peppers.', tags: ['vegetarian', 'spicy', 'Indo-Chinese'], ingredients: [['Cauliflower florets', '3 cups'], ['Cornflour', '3 tbsp'], ['Rice flour', '2 tbsp'], ['Green chilli', '2, slit'], ['Capsicum', '1/2, chopped'], ['Garlic', '4 cloves'], ['Soy sauce', '1 tsp'], ['Chilli sauce', '1 tbsp'], ['Spring onion', '2 tbsp'], ['Oil', 'for frying'], ['Salt', 'to taste']], instructions: ['Coat cauliflower florets in a batter of cornflour, rice flour, salt and water.', 'Fry until crisp and set aside.', 'In a hot pan, sauté garlic, green chilli and capsicum.', 'Add soy sauce and chilli sauce with a splash of water.', 'Toss in the cauliflower, garnish with spring onion and serve hot.'] }),
  makeRecipe({ id: 'si-avial', name: 'Kerala Avial', category: 'Vegetarian', description: 'A traditional mix of vegetables with coconut, cumin and yoghurt.', tags: ['Kerala', 'vegetarian', 'Onam'], ingredients: [['Mixed vegetables', '3 cups, cut into batons'], ['Grated coconut', '1 cup'], ['Green chilli', '2'], ['Cumin seeds', '1/2 tsp'], ['Yoghurt', '1/2 cup'], ['Curry leaves', '2 sprigs'], ['Coconut oil', '1 tbsp'], ['Turmeric', '1/4 tsp'], ['Salt', 'to taste']], instructions: ['Cook firm vegetables with turmeric, salt and a little water until just tender.', 'Grind coconut, green chilli and cumin coarsely.', 'Fold the coconut mixture into the vegetables and cook gently for a few minutes.', 'Turn off the heat and stir in yoghurt.', 'Finish with curry leaves and coconut oil. Avoid over-stirring so the vegetables keep their shape.'] }),
  makeRecipe({ id: 'si-sambar', name: 'South Indian Sambar', category: 'Vegetarian', description: 'A comforting lentil and vegetable stew with tamarind and sambar spices.', tags: ['South Indian', 'vegetarian', 'lentils'], ingredients: [['Toor dal', '3/4 cup'], ['Mixed vegetables', '2 cups'], ['Tamarind', 'small lemon-sized piece'], ['Sambar powder', '2 tbsp'], ['Tomato', '1'], ['Mustard seeds', '1/2 tsp'], ['Dried red chilli', '2'], ['Curry leaves', '1 sprig'], ['Turmeric', '1/4 tsp'], ['Oil', '1 tbsp'], ['Salt', 'to taste']], instructions: ['Pressure-cook toor dal with turmeric until soft, then mash.', 'Cook vegetables and tomato until tender.', 'Add tamarind water, sambar powder and salt; simmer for 8–10 minutes.', 'Stir in mashed dal and adjust the consistency with water.', 'Temper mustard seeds, dried red chilli and curry leaves in hot oil; pour over the sambar.'] }),
  makeRecipe({ id: 'si-masala-dosa', name: 'Masala Dosa', category: 'Vegetarian', description: 'Crisp dosa filled with a gently spiced potato masala.', tags: ['South Indian', 'breakfast', 'vegetarian'], ingredients: [['Dosa batter', '2 cups'], ['Potatoes', '3, boiled'], ['Onion', '1, sliced'], ['Green chilli', '2'], ['Mustard seeds', '1/2 tsp'], ['Turmeric', '1/4 tsp'], ['Curry leaves', '1 sprig'], ['Oil or ghee', '2 tbsp'], ['Salt', 'to taste']], instructions: ['Heat oil in a pan and splutter mustard seeds. Add curry leaves, chilli and onion.', 'Add turmeric, salt and crumbled boiled potatoes. Mix with a little water to make the filling.', 'Spread a ladle of dosa batter thinly on a hot greased tawa.', 'Drizzle oil or ghee and cook until the underside turns crisp.', 'Place potato masala in the centre, fold and serve with chutney and sambar.'] }),
];

export function findLocalRecipe(id) {
  return southIndianRecipes.find((recipe) => recipe.idMeal === id) || null;
}

export function searchLocalRecipes(query = '') {
  const cleaned = query.trim().toLowerCase();
  if (!cleaned) return southIndianRecipes;
  const aliases = {
    chicken: ['si-chicken-curry', 'si-chicken-roast', 'si-tandoori-chicken', 'si-chicken-65','si-chicken-handi','si-chicken-lollipop'],
    seafood: ['si-karimeen-mappas', 'si-karimeen-pollichathu', 'si-prawn-curry', 'si-prawn-roast', 'si-kallumakkaya', 'si-fish-molee'],
    fish: ['si-karimeen-mappas', 'si-karimeen-pollichathu', 'si-fish-molee'],
    prawns: ['si-prawn-curry', 'si-prawn-roast'],
    prawn: ['si-prawn-curry', 'si-prawn-roast'],
    vegetarian: ['si-veg-kuruma', 'si-gobi-manchurian', 'si-chilli-gobi', 'si-avial', 'si-sambar', 'si-masala-dosa'],
    veg: ['si-veg-kuruma', 'si-gobi-manchurian', 'si-chilli-gobi', 'si-avial', 'si-sambar', 'si-masala-dosa'],
    kerala: ['si-chicken-curry', 'si-chicken-roast', 'si-karimeen-mappas', 'si-karimeen-pollichathu', 'si-prawn-curry', 'si-prawn-roast', 'si-kallumakkaya', 'si-fish-molee', 'si-veg-kuruma', 'si-avial'],
    curry: ['si-chicken-curry', 'si-karimeen-mappas', 'si-prawn-curry', 'si-fish-molee', 'si-veg-kuruma', 'si-sambar'],
    gopi: ['si-gobi-manchurian', 'si-chilli-gobi'],
    gobi: ['si-gobi-manchurian', 'si-chilli-gobi'],
    manchurian: ['si-gobi-manchurian'],
    mappas: ['si-karimeen-mappas'],
    kallumekkaya: ['si-kallumakkaya'],
    kallumakkaya: ['si-kallumakkaya'],
    dosa: ['si-masala-dosa'],
  };
  if (aliases[cleaned]) return southIndianRecipes.filter((recipe) => aliases[cleaned].includes(recipe.idMeal));
  return southIndianRecipes.filter((recipe) => {
    const searchable = [recipe.strMeal, recipe.strCategory, recipe.strArea, recipe.strDescription, recipe.strTags,
      ...Array.from({ length: 20 }, (_, i) => recipe[`strIngredient${i + 1}`] || '')].join(' ').toLowerCase();
    return searchable.includes(cleaned);
  });
}
