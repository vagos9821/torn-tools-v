"use strict";

(async () => {
	featureManager.registerFeature(
		"Custom Theming",
		"global",
		() => settings.customTheming.enabled,
		null,
		applyCustomTheme,
		removeCustomTheme,
		{
			storage: [
				"settings.customTheming.enabled",
				"settings.customTheming.backgroundImage",
				"settings.customTheming.backgroundColor",
				"settings.customTheming.backgroundOpacity",
				"settings.customTheming.backgroundSize",
				"settings.customTheming.applyToElements",
				"settings.customTheming.customFont",
				"settings.customTheming.customFontFamily",
			],
		},
		null
	);

	let styleElement = null;
	let fontStyleElement = null;

	function applyCustomTheme() {
		removeCustomTheme();

		const theme = settings.customTheming;
		if (!theme.enabled) return;

		// Create style element for theming
		styleElement = document.createElement("style");
		styleElement.id = "tt-custom-theming";
		styleElement.textContent = generateThemeCSS(theme);
		document.head.appendChild(styleElement);

		// Apply custom font if provided
		if (theme.customFont && theme.customFontFamily) {
			fontStyleElement = document.createElement("style");
			fontStyleElement.id = "tt-custom-font";
			fontStyleElement.textContent = generateFontCSS(theme);
			document.head.appendChild(fontStyleElement);
		}
	}

	function generateThemeCSS(theme) {
		let css = "";

		// Apply background to body
		if (theme.backgroundImage || theme.backgroundColor) {
			const bgImage = theme.backgroundImage ? `url(${theme.backgroundImage})` : "none";
			const bgColor = theme.backgroundColor || "transparent";

			css += `
				body {
					background: ${bgImage} ${bgColor} !important;
					background-size: ${theme.backgroundSize || "cover"} !important;
					background-attachment: fixed !important;
					background-position: center !important;
					background-repeat: no-repeat !important;
				}
			`;
		}

		// Apply opacity to elements (similar to the userscript)
		if (theme.applyToElements && (theme.backgroundImage || theme.backgroundColor)) {
			const opacity = theme.backgroundOpacity ?? 0.1;

			css += `
				div:not(
					#tcLogo,
					[class^='progress-line_'],
					.progressbar-wrap, .progressbar-wrap *,
					.bar, .bar *,
					[class^="crime_"],
					[class^="crime_"] *,
					[class^="chat-app"] *,
					.header-wrap *,
					[class^="buttonContainer"] *,
					#profile-mini-root *,
					[class^="snippet_"] *,
					[class^="leadImageWrap_"] *,
					[class^="levelBar_"] *,
					div > a *,
					[class^="hand"] *,
					[class^="card"] *,
					[class^="cell"] *,
					#tt-page-status *,
					.tt-container *,
					[class*="torntools"] *
				) {
					background: rgba(0, 0, 0, ${opacity}) !important;
				}
			`;
		}

		// Apply custom font
		if (theme.customFontFamily) {
			css += `
				body, body * {
					font-family: ${theme.customFontFamily}, sans-serif !important;
				}
			`;
		}

		return css;
	}

	function generateFontCSS(theme) {
		if (!theme.customFont || !theme.customFontFamily) return "";

		// Check if the custom font is a URL or data URL
		const fontUrl = theme.customFont;

		return `
			@font-face {
				font-family: '${theme.customFontFamily}';
				src: url('${fontUrl}');
				font-weight: normal;
				font-style: normal;
			}
		`;
	}

	function removeCustomTheme() {
		if (styleElement && styleElement.parentNode) {
			styleElement.remove();
			styleElement = null;
		}
		if (fontStyleElement && fontStyleElement.parentNode) {
			fontStyleElement.remove();
			fontStyleElement = null;
		}
	}
})();
