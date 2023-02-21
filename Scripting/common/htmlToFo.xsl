<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
				xmlns:fo="http://www.w3.org/1999/XSL/Format"
                version="1.0">

<xsl:output method="xml" indent="yes"/>
<xsl:variable name="pagewidth" select="21.5"/>
<xsl:variable name="bodywidth" select="19"/>
<xsl:template match="html">
	<fo:block-container width="17cm" margin-top="3mm">
		<xsl:apply-templates />
	</fo:block-container>
</xsl:template>

<xsl:template match="blockquote">
	<fo:block
		space-before="6pt" space-after="6pt"
		margin-left="1em" margin-right="1em" font-style="italic" color="grey">
	<xsl:call-template name="set-pagebreak"/>
	<xsl:apply-templates/>
	</fo:block>
</xsl:template>

<xsl:template match="h1">
	<fo:block font-size="25pt" font-weight="bold">
	<xsl:call-template name="set-alignment"/>
	<xsl:call-template name="set-pagebreak"/>
	<xsl:apply-templates/>
	</fo:block>
</xsl:template>

<xsl:template match="h2">
	<fo:block font-size="21pt" font-weight="bold">
	<xsl:call-template name="set-alignment"/>
	<xsl:call-template name="set-pagebreak"/>
	<xsl:apply-templates/>
	</fo:block>
</xsl:template>

<xsl:template match="h3">
<fo:block font-size="17pt" font-weight="bold">
	<xsl:call-template name="set-alignment"/>
	<xsl:call-template name="set-pagebreak"/>
	<xsl:apply-templates/>
</fo:block>
</xsl:template>

<xsl:template match="h4">
<fo:block font-size="15pt" font-weight="bold">
	<xsl:call-template name="set-alignment"/>
	<xsl:call-template name="set-pagebreak"/>
	<xsl:apply-templates/>
</fo:block>
</xsl:template>

<xsl:template match="h5">
<fo:block font-size="12pt" font-weight="bold">
	<xsl:call-template name="set-alignment"/>
	<xsl:call-template name="set-pagebreak"/>
	<xsl:apply-templates/>
</fo:block>
</xsl:template>

<xsl:template match="h6">
<fo:block font-size="11pt" font-weight="bold" text-transform="uppercase" letter-spacing="0.35em">
	<xsl:call-template name="set-alignment"/>
	<xsl:call-template name="set-pagebreak"/>
	<xsl:apply-templates/>
</fo:block>
</xsl:template>

<xsl:template name="set-alignment">
	<xsl:choose>
	<xsl:when test="@align='left' or contains(@class,'left')">
		<xsl:attribute name="text-align">start</xsl:attribute>
	</xsl:when>
	<xsl:when test="@align='center' or contains(@class,'center')">
		<xsl:attribute name="text-align">center</xsl:attribute>
	</xsl:when>
	<xsl:when test="@align='right' or contains(@class,'right')">
		<xsl:attribute name="text-align">end</xsl:attribute>
	</xsl:when>
	</xsl:choose>
</xsl:template>

<xsl:template name="set-pagebreak">
	<xsl:if test="contains(@style, 'page-break-before')">
		<xsl:attribute name="break-before">page</xsl:attribute>
	</xsl:if>
	<xsl:if test="contains(@style, 'page-break-after')">
		<xsl:attribute name="break-after">page</xsl:attribute>
	<xsl:message><xsl:value-of select="@style"/></xsl:message>
	</xsl:if>
</xsl:template>

<xsl:template match="p">
	<fo:block space-before="4pt" space-after="4pt" linefeed-treatment="preserve">
		<xsl:call-template name="set-alignment"/>
		<xsl:call-template name="set-pagebreak"/>
		<xsl:apply-templates/>
	</fo:block>
</xsl:template>

<xsl:template match="ol">
	<fo:list-block provisional-distance-between-starts="6mm"
	  provisional-label-separation="6mm"
	   space-after="6pt">
		<xsl:call-template name="set-pagebreak"/>
		<xsl:apply-templates/>
	</fo:list-block>
</xsl:template>

<xsl:template match="ol/li">
	<fo:list-item space-after="1mm">
		<fo:list-item-label>
			<fo:block>
				<xsl:choose>
					<xsl:when test="count(ancestor::ol) = 1">
						<xsl:number format="1"/>.
					</xsl:when>
					<xsl:when test="count(ancestor::ol) = 2">
						<xsl:number format="a"/>.
					</xsl:when>
					<xsl:otherwise>
						<xsl:number format="i"/>.
					</xsl:otherwise>
				</xsl:choose>
			</fo:block>
		</fo:list-item-label>
		<fo:list-item-body start-indent="body-start()">
			<fo:block>
				<xsl:apply-templates/>
			</fo:block>
		</fo:list-item-body>
	</fo:list-item>
</xsl:template>

<xsl:template match="ul">
	<fo:list-block provisional-distance-between-starts="6mm"
               provisional-label-separation="6mm"
               space-after="5pt" >
		<xsl:call-template name="set-pagebreak"/>
		<xsl:apply-templates/>
	</fo:list-block>
</xsl:template>

<xsl:template match="ul/li">
	<fo:list-item space-after="5pt">
		<fo:list-item-label>
			<fo:block>&#x2022;</fo:block>
		</fo:list-item-label>
		<fo:list-item-body start-indent="body-start()">
			<fo:block>
				<xsl:apply-templates/>
			</fo:block>
		</fo:list-item-body>
	</fo:list-item>
</xsl:template>

<xsl:template name="find-width">
	<xsl:param name="node"/>
	<xsl:choose>
		<xsl:when test="@width">
			<xsl:value-of select="@width"/>
		</xsl:when>
		<xsl:when test="@style">
			<xsl:value-of select="substring-before(
				substring-after(@style, ':'), ';')"/>
		</xsl:when>
		<xsl:otherwise>0</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template match="code">
	<fo:inline font-family="monospace"><xsl:apply-templates/></fo:inline>
</xsl:template>

<xsl:template match="img">
	<fo:external-graphic>
	<xsl:attribute name="src">file:<xsl:value-of
		select="@src"/></xsl:attribute>
	<xsl:attribute name="width"><xsl:value-of
		select="@width"/>px</xsl:attribute>
	<xsl:attribute name="height"><xsl:value-of
		select="@height"/>px</xsl:attribute>
	</fo:external-graphic>
</xsl:template>

<xsl:template match="pre">
	<fo:block white-space-collapse="false" font-family="monospace" font-size="10pt" background-color="#f6f7f8" padding="12pt"><xsl:apply-templates/></fo:block>
</xsl:template>

<xsl:template match="b|strong">
	<fo:inline font-weight="bold"><xsl:apply-templates/></fo:inline>
</xsl:template>

<xsl:template match="i|em">
	<fo:inline font-style="italic"><xsl:apply-templates/></fo:inline>
</xsl:template>

<xsl:template match="del">
	<fo:inline text-decoration="line-through"><xsl:apply-templates/></fo:inline>
</xsl:template>

<xsl:template match="a">
	<fo:basic-link color="blue">
	<xsl:attribute name="external-destination"><xsl:value-of
		select="@href"/></xsl:attribute>
		<xsl:apply-templates/></fo:basic-link>
</xsl:template>

<xsl:template match="br">
<fo:block><xsl:text>&#xA;</xsl:text></fo:block>
</xsl:template>

</xsl:stylesheet>