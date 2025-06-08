"""Test render routes."""

import pytest
from httpx import AsyncClient


OUTPUT = """
<body>

<div class="manuscriptwrapper">

<div class="manuscript" data-nodeid="0">

<section class="level-1">

<div class="paragraph hr hr-hidden" tabindex=0 data-nodeid="1">

<div class="hr-collapse-zone">
<div class="hr-spacer"></div>
</div>

<div class="hr-menu-zone">

<div class="hr-menu">

  <div class="hr-menu-label">
    <span class="hr-menu-item-text">Paragraph</span>
  </div>

  <div class="hr-menu-separator"></div>

  <div class="hr-menu-item link disabled">
    <span class="icon link">
    </span>
    <span class="hr-menu-item-text">Copy link</span>
  </div>

  <div class="hr-menu-item">
    <span class="icon tree">
    </span>
    <span class="hr-menu-item-text">Tree</span>
  </div>

  <div class="hr-menu-item">
    <span class="icon code">
    </span>
    <span class="hr-menu-item-text">Source</span>
  </div>

</div>

</div>

<div class="hr-border-zone">

                <div class="hr-border-dots">
                  <div class="icon dots">
                  </div>
                </div>
                <div class="hr-border-rect">
                </div>

</div>

<div class="hr-spacer-zone">
<div class="hr-spacer"></div>
</div>

<div class="hr-content-zone">

<p>foo</p>

</div>

<div class="hr-info-zone">
<div class="hr-info"></div>
</div>

</div>

</section>

</div>

</div>

</body>
"""


@pytest.mark.asyncio
async def test_render(client: AsyncClient):
    """Test that files endpoint requires authentication."""
    response = await client.post("/render", json={"source": ":rsm:foo::"})
    assert response.status_code == 200
    assert OUTPUT.strip() == response.json().strip()
