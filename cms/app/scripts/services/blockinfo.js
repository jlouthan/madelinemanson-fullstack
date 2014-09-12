'use strict';

angular.module('cmsFrontendApp')
  .service('blockInfo', function() {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getNameFromBlockType = function(type){
    	var newName = '';

		switch(type)
		{
		case '23right':
			newName = 'Image Right';
			break;
		case '23left':
			newName = 'Image Left';
			break;
		case 'fullBleed':
			newName = 'Image Break';
			break;
		case 'pullQuote':
			newName = 'Pull Quote';
			break;
		case '23rightVideo':
			newName = 'Embed Video Right';
			break;
		case '23leftVideo':
			newName = 'Embed Video Left';
			break;
		// blog post blocks
		case 'body':
			newName = 'Body Copy';
			break;
		case 'image':
			newName = 'Full Size Image';
			break;
		case 'code':
			newName = 'Code Snippet';
			break;
		case 'video':
			newName = 'Embed Video';
			break;
		case 'Teaser Image':
			newName = 'Teaser Image';
			break;
		case 'Lead Photo':
			newName = 'Lead Photo';
			break;
		case 'Blog Teaser Image':
			newName = 'Blog Teaser';
			break;
		case 'Hero Parallax Image':
			newName = 'Hero Parallax';
			break;
		case 'Avatar BW':
			newName = 'Avatar (B&W)';
			break;
		case 'Avatar Color':
			newName = 'Avatar (Color)';
			break;
		}
		return newName;
    },

    this.getIconFromBlockType = function(type){
    	var iconName = '';

		switch(type)
		{
		case '23right':
			iconName = 'icon-contentRight';
			break;
		case '23left':
			iconName = 'icon-contentLeft';
			break;
		case 'fullBleed':
			iconName = 'icon-imgBreak';
			break;
		case 'pullQuote':
			iconName = 'icon-pullquote';
			break;
		case '23rightVideo':
			iconName = 'icon-videoRight';
			break;
		case '23leftVideo':
			iconName = 'icon-videoLeft';
			break;
		// blog post blocks
		case 'body':
			iconName = 'icon-text';
			break;
		case 'image':
			iconName = 'icon-img';
			break;
		case 'code':
			iconName = 'icon-code';
			break;
		case 'video':
			iconName = 'icon-video';
			break;
		case 'Teaser Image':
			iconName = 'icon-projectTeaser';
			break;
		case 'Lead Photo':
			iconName = 'icon-contentLead';
			break;
		case 'Blog Teaser Image':
			iconName = 'icon-blogTeaser';
			break;
		case 'Hero Parallax Image':
			iconName = 'icon-imgHero';
			break;
		case 'Avatar BW':
			iconName = 'icon-profile';
			break;
		case 'Avatar Color':
			iconName = 'icon-profile';
			break;
		}
		return iconName;
    },

    this.getSpecsForBlockType = function(type){
    	var specString = '';

    	switch(type)
    	{
    	case 'Teaser Image':
    		specString = 'At Least 1158px x 760px';
    		break;
    	case 'Lead Photo':
			specString = 'At Least 1920px x 1260px';
			break;
    	case '23right':
			specString = 'At Least 1920px x 1260px';
			break;
		case '23left':
			specString = 'At Least 1920px x 1260px';
			break;
    	case 'fullBleed':
    		specString = 'At Least 3360px x 1120px';
    		break;
    	case 'image':
			specString = 'At Least 1920px x 1260px';
			break;
		case 'Blog Teaser Image':
			specString = 'At Least 800px x 800px';
			break;
		case 'Hero Parallax Image':
			specString = 'At Least 3360 px WIDE, variable height';
			break;
		case 'Avatar BW':
			specString = 'At Least 600 px x 600px';
			break;
		case 'Avatar Color':
			specString = 'At Least 600 px x 600px';
			break;
    	}
    	return specString;
    }

    this.getInfoForBlockType = function(type){
    	var description = '';

    	switch(type)
    	{
    	case 'Teaser Image':
    		description = 'Appears in the All Projects grid';
    		break;
    	case 'Lead Photo':
			description = 'Appears at the top of the project page';
    		break;
    	case '23right':
			description = 'Standard project image left with text right';
    		break;
		case '23left':
			description = 'Standard project image right with text left';
    		break;
    	case 'fullBleed':
    		description = 'Full width compositional image break';
    		break;
    	case 'image':
			description = 'Appears inline within the blog post';
    		break;
		case 'Blog Teaser Image':
			description = 'Appears in a circular crop on the blog page';
    		break;
		case 'Hero Parallax Image':
			description = 'Fills area above post with scroll effect';
    		break;
		case 'Avatar BW':
			description = 'Appears on US grid, profile page, & blog posts';
    		break;
		case 'Avatar Color':
			description = 'Appears on hover over black & white avatar on US page';
    		break;
    	}
    	return description;
    }

    this.getUrlForBlockType = function(type){
    	var url = '';

    	switch(type)
    	{
    	case 'Teaser Image':
    		url = '/resize-workteaser/';
    		break;
    	case 'Lead Photo':
			url = '/resize-lead/';
    		break;
    	case '23right':
			url = '/resize-contentimage/';
    		break;
		case '23left':
			url = '/resize-contentimage/';
    		break;
    	case 'fullBleed':
    		url = '/resize-imagebreak/';
    		break;
    	case 'image':
			url = '/resize-fullsize/';
    		break;
		case 'Blog Teaser Image':
			url = '/resize-blogteaser/';
    		break;
		case 'Hero Parallax Image':
			url = '/resize-hero/';
    		break;
		case 'Avatar BW':
			url = '/resize-avatar/';
    		break;
		case 'Avatar Color':
			url = '/resize-avatar/';
    		break;
    	}
    	return url;
    }

    this.getAltTextBoolean = function(type){
    	var hasAltText = true;

    	switch(type)
    	{
    	case 'Blog Teaser Image':
    		hasAltText = false;
    		break;
    	case 'Hero Parallax Image':
    		hasAltText = false;
    		break;
    	case 'Teaser Image':
    		hasAltText = false;
    		break;
    	case 'Lead Photo':
    		hasAltText = false;
    		break;
    	case 'Avatar BW':
			hasAltText = false;
    		break;
		case 'Avatar Color':
			hasAltText = false;
    		break;
    	}
    	return hasAltText;
    }

  });
