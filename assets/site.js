(function () {
  "use strict";

  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) closeNav();
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  var langSwitch = document.querySelector(".lang-switch");
  if (langSwitch && window.location.search) {
    langSwitch.href += window.location.search;
  }

  var form = document.querySelector("#rfq-form");
  if (!form) return;

  var status = document.querySelector("#form-status");
  var summaryBox = document.querySelector("#form-summary");
  var copyButton = document.querySelector("#copy-summary");
  var emailLink = document.querySelector("#email-again");
  var email = form.getAttribute("data-email") || "dylan_shi@hotmail.com";
  var lastMailto = "";
  var sourceInput = form.querySelector('input[name="source"]');
  var params = new URLSearchParams(window.location.search);
  var source =
    params.get("src") ||
    params.get("utm_source") ||
    params.get("ref") ||
    "website";

  if (sourceInput) sourceInput.value = source;

  function checkedCustomization() {
    return Array.prototype.slice
      .call(form.querySelectorAll('input[name="customization"]:checked'))
      .map(function (input) {
        return input.value;
      })
      .join(", ");
  }

  function collect() {
    var data = new FormData(form);
    return {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      company: String(data.get("company") || "").trim(),
      product: String(data.get("product") || "").trim(),
      quantity: String(data.get("quantity") || "").trim(),
      destination: String(data.get("destination") || "").trim(),
      service: String(data.get("service") || "").trim(),
      targetDate: String(data.get("target_date") || "").trim(),
      customization: checkedCustomization(),
      details: String(data.get("details") || "").trim(),
      source: String(data.get("source") || source).trim()
    };
  }

  var isZh = document.documentElement.lang.indexOf("zh") === 0;
  var L = isZh
    ? {
        intro: "网站新询价",
        name: "姓名",
        email: "邮箱",
        company: "公司",
        product: "产品 / 品类",
        quantity: "数量",
        destination: "目的国",
        service: "服务",
        customization: "定制内容",
        targetDate: "目标日期",
        source: "来源",
        details: "详情"
      }
    : {
        intro: "New RFQ from the website",
        name: "Name",
        email: "Email",
        company: "Company",
        product: "Product / category",
        quantity: "Quantity",
        destination: "Destination",
        service: "Service",
        customization: "Customization",
        targetDate: "Target date",
        source: "Source",
        details: "Details"
      };

  function buildSummary(data) {
    var lines = [
      L.intro,
      "",
      L.name + ": " + data.name,
      L.email + ": " + data.email,
      L.company + ": " + (data.company || "—"),
      L.product + ": " + data.product,
      L.quantity + ": " + data.quantity,
      L.destination + ": " + data.destination,
      L.service + ": " + data.service,
      L.customization + ": " + (data.customization || "—"),
      L.targetDate + ": " + (data.targetDate || "—"),
      L.source + ": " + (data.source || "website"),
      "",
      L.details + ":",
      data.details
    ];
    return lines.join("\n");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) return;

    var data = collect();
    var summary = buildSummary(data);
    var subject = "RFQ — " + data.product + " — " + data.quantity;
    lastMailto =
      "mailto:" +
      email +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(summary);

    if (summaryBox) summaryBox.textContent = summary;
    if (emailLink) emailLink.setAttribute("href", lastMailto);
    if (status) {
      status.classList.add("show");
      status.focus();
    }

    window.location.href = lastMailto;
  });

  if (copyButton && summaryBox) {
    copyButton.addEventListener("click", function () {
      var text = summaryBox.textContent || "";
      if (!text) return;

      function done() {
        var original = copyButton.textContent;
        copyButton.textContent = isZh ? "已复制" : "Copied";
        window.setTimeout(function () {
          copyButton.textContent = original;
        }, 1600);
      }

      var promptText = isZh ? "复制询价摘要：" : "Copy your RFQ summary:";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          window.prompt(promptText, text);
        });
      } else {
        window.prompt(promptText, text);
      }
    });
  }
})();
