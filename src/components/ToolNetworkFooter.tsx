export default function ToolNetworkFooter() {
  const tools = [
    { name: "AI工具宝", href: "https://tyr1105.github.io/ai-tools-box/" },
    { name: "DevKit工具箱", href: "https://tyr1105.github.io/devkit-tools/" },
    { name: "PicTool图片工具", href: "https://tyr1105.github.io/pictool/" },
    { name: "QRGen二维码", href: "https://tyr1105.github.io/qrgen/" },
    { name: "RedCover红包封面", href: "https://tyr1105.github.io/redcover/" },
    { name: "ResumeCraft简历", href: "https://tyr1105.github.io/resumecraft/" },
    { name: "ShotPro截图", href: "https://tyr1105.github.io/shotpro/" },
    { name: "WriteBoom文案", href: "https://tyr1105.github.io/writeboom/" },
    { name: "PDFKit工具", href: "https://tyr1105.github.io/pdfkit/" },
  ];

  return (
    <footer
      style={{
        background: "#111827",
        borderTop: "1px solid #1f2937",
        padding: "32px 16px",
        marginTop: "auto",
      }}
    >
      {/* Google AdSense Placeholder */}
      {/* <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="XXXXXXXXXX" data-ad-format="auto"></ins> */}

      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          color: "#9ca3af",
          fontSize: "14px",
          lineHeight: "1.8",
        }}
      >
        <div style={{ marginBottom: "16px", color: "#e5e7eb", fontWeight: 600, fontSize: "15px" }}>
          🛠 Tool Network - 更多在线工具
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 20px",
            marginBottom: "20px",
          }}
        >
          {tools.map((tool) => (
            <a
              key={tool.name}
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#60a5fa", textDecoration: "none" }}
            >
              {tool.name}
            </a>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid #1f2937",
            paddingTop: "12px",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#6b7280" }}>❤️ 支持作者：</span>
          <a
            href="https://buymeacoffee.com/tyr1105"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#60a5fa", textDecoration: "none" }}
          >
            Buy Me a Coffee
          </a>
          <a
            href="https://github.com/sponsors/tyr1105"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#60a5fa", textDecoration: "none" }}
          >
            GitHub Sponsors
          </a>
          <span style={{ color: "#6b7280", marginLeft: "auto" }}>
            © {new Date().getFullYear()} tyr1105
          </span>
        </div>
      </div>
    </footer>
  );
}
