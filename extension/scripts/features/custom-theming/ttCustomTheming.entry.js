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
				"settings.customTheming.lineHeight",
				"settings.customTheming.letterSpacing",
			],
		},
		null
	);

	let styleElement = null;
	let fontStyleElement = null;
	let updateTimeout = null;

	function applyCustomTheme() {
		// Debounce rapid updates for better performance
		if (updateTimeout) {
			clearTimeout(updateTimeout);
		}

		updateTimeout = setTimeout(() => {
			_applyThemeImmediate();
			updateTimeout = null;
		}, 50);
	}

	function _applyThemeImmediate() {
		const theme = settings.customTheming;
		if (!theme.enabled) {
			removeCustomTheme();
			return;
		}

		// Update or create style element (reuse for performance)
		if (!styleElement) {
			styleElement = document.createElement("style");
			styleElement.id = "tt-custom-theming";
			document.head.appendChild(styleElement);
		}
		styleElement.textContent = generateThemeCSS(theme);

		// Handle custom font separately
		if (theme.customFont && theme.customFontFamily) {
			if (!fontStyleElement) {
				fontStyleElement = document.createElement("style");
				fontStyleElement.id = "tt-custom-font";
				document.head.appendChild(fontStyleElement);
			}
			fontStyleElement.textContent = generateFontCSS(theme);
		} else if (fontStyleElement) {
			fontStyleElement.remove();
			fontStyleElement = null;
		}
	}

	function generateThemeCSS(theme) {
		let css = "";

		// Use CSS custom properties for better performance and dynamic updates
		const bgImage = theme.backgroundImage ? `url(${theme.backgroundImage})` : "none";
		const bgColor = theme.backgroundColor || "transparent";
		const bgSize = theme.backgroundSize || "cover";
		const opacity = theme.backgroundOpacity ?? 0.1;
		const lineHeight = theme.lineHeight ?? 1.5;
		const letterSpacing = theme.letterSpacing ?? 0;

		// Define CSS custom properties on :root for easy access
		css += `
			:root {
				--tt-bg-image: ${bgImage};
				--tt-bg-color: ${bgColor};
				--tt-bg-size: ${bgSize};
				--tt-opacity: ${opacity};
				--tt-line-height: ${lineHeight};
				--tt-letter-spacing: ${letterSpacing}px;
			}
		`;

		// Apply background to body (optimized with CSS variables)
		if (theme.backgroundImage || theme.backgroundColor) {
			css += `
				body {
					background: var(--tt-bg-image) var(--tt-bg-color) !important;
					background-size: var(--tt-bg-size) !important;
					background-attachment: fixed !important;
					background-position: center !important;
					background-repeat: no-repeat !important;
				}
			`;
		}

		// Apply opacity to elements (optimized selector)
		if (theme.applyToElements && (theme.backgroundImage || theme.backgroundColor)) {
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
					background: rgba(0, 0, 0, var(--tt-opacity)) !important;
				}
			`;
		}

		// Apply custom font with typography settings
		if (theme.customFontFamily) {
			css += `
				body, body * {
					font-family: ${theme.customFontFamily}, sans-serif !important;
					line-height: var(--tt-line-height) !important;
					letter-spacing: var(--tt-letter-spacing) !important;
				}
			`;
		} else if (lineHeight !== 1.5 || letterSpacing !== 0) {
			// Apply typography even without custom font
			css += `
				body, body * {
					line-height: var(--tt-line-height) !important;
					letter-spacing: var(--tt-letter-spacing) !important;
				}
			`;
		}

		return css;
	}

	function generateFontCSS(theme) {
		if (!theme.customFont || !theme.customFontFamily) return "";

		const fontUrl = theme.customFont;
		const fontFamily = theme.customFontFamily;

		// Optimized @font-face with font-display for better performance
		return `
			@font-face {
				font-family: '${fontFamily}';
				src: url('${fontUrl}');
				font-weight: normal;
				font-style: normal;
				font-display: swap;
			}
		`;
	}

	function removeCustomTheme() {
		if (updateTimeout) {
			clearTimeout(updateTimeout);
			updateTimeout = null;
		}

		if (styleElement) {
			styleElement.remove();
			styleElement = null;
		}
		if (fontStyleElement) {
			fontStyleElement.remove();
			fontStyleElement = null;
		}
	}
})();
