import { VisLogAppSettings } from "../../../2.0/dist/vis-side/vis-log-appsettings";

const vis = new VisLogAppSettings();
let is_toggle = false;
let is_seq_in_progress = false;

AppSettingsPage({
  build(props) {
    if (!vis.initialized()) {
      vis.attachSettingsRelay(props.settingsStorage);
      vis.log("Settings page open!");
    }
    
    return Section(
      {
        style: {
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif'
        }
      },
      [
        // header
        View(
          {
            style: {
              backgroundColor: 'white',
              padding: '20px',
              borderBottom: '1px solid #e9ecef',
              marginBottom: '20px'
            }
          },
          [
            Text({
              style: {
                fontSize: '24px',
                fontWeight: '600',
                color: '#212529',
                textAlign: 'center',
                marginBottom: '8px'
              }
            }, "VisLog Settings Page"),
            Text({
              style: {
                fontSize: '14px',
                color: '#6c757d',
                textAlign: 'center'
              }
            })
          ]
        ),

        // log levels
        View(
          {
            style: {
              backgroundColor: 'white',
              margin: '0 20px 20px 20px',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }
          },
          [
            Text({
              style: {
                fontSize: '16px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '15px'
              }
            }, "Log Levels"),
            
            View(
              {
                style: {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '15px'
                }
              },
              [
                Button({
                  label: 'LOG',
                  style: {
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px',
                    fontSize: '14px',
                    fontWeight: '500'
                  },
                  onClick: () => {
                    vis.log("LOG message");
                  }
                }),
                Button({
                  label: 'INFO',
                  style: {
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px',
                    fontSize: '14px',
                    fontWeight: '500'
                  },
                  onClick: () => {
                    vis.info("INFO message");
                  }
                }),
                Button({
                  label: 'WARN',
                  style: {
                    backgroundColor: '#ffc107',
                    color: '#212529',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px',
                    fontSize: '14px',
                    fontWeight: '500'
                  },
                  onClick: () => {
                    vis.warn("WARNING message");
                  }
                }),
                Button({
                  label: 'ERROR',
                  style: {
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px',
                    fontSize: '14px',
                    fontWeight: '500'
                  },
                  onClick: () => {
                    vis.error("ERROR message");
                  }
                })
              ]
            )
          ]
        ),

        // interactive
        View(
          {
            style: {
              backgroundColor: 'white',
              margin: '0 20px 20px 20px',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }
          },
          [
            Text({
              style: {
                fontSize: '16px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '15px'
              }
            }, "Interactive Testing"),
            
            TextInput({
              placeholder: "Type something...",
              label: "Input Field",
              onChange: (value) => {
                vis.log("Input:", value);
              },
              labelStyle: {
                fontSize: '14px',
                color: '#495057',
                marginBottom: '8px',
                display: 'block'
              },
              style: {
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
                marginBottom: '15px'
              }
            }),

            View(
              {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }
              },
              [
                Text({
                  style: {
                    fontSize: '14px',
                    color: '#495057'
                  }
                }, "Toggle Me"),
                Button({
                  label: is_toggle ? 'ON' : 'OFF',
                  style: {
                    backgroundColor: is_toggle ? '#28a745' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 12px',
                    fontSize: '12px'
                  },
                  onClick: () => {
                    is_toggle = !is_toggle;
                    vis.log("Toggle:", is_toggle ? "enabled" : "disabled");
                  }
                })
              ]
            )
          ]
        ),

        // utility
        View(
          {
            style: {
              backgroundColor: 'white',
              margin: '0 20px 20px 20px',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }
          },
          [
            Text({
              style: {
                fontSize: '16px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '15px'
              }
            }, "Utility Actions"),
            
            View(
              {
                style: {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px'
                }
              },
              [
                Button({
                  label: 'Roll a Dice',
                  style: {
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px',
                    fontSize: '14px'
                  },
                  onClick: () => {
                    const rand_num = Math.floor(Math.random() * 6) + 1; 
                    vis.log("Rolled:", rand_num);
                  }
                }),
                Button({
                  label: 'Test Sequence',
                  style: {
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px',
                    fontSize: '14px'
                  },
                  onClick: () => {
                    if (!is_seq_in_progress) is_seq_in_progress = true;
                    else return;

                    vis.log("Starting test sequence...");
                    setTimeout(() => vis.info("3..."), 500);
                    setTimeout(() => vis.warn("2..."), 1500);
                    setTimeout(() => vis.log("1..."), 2500);
                    setTimeout(() => { 
                      vis.log("Go!"); 
                      is_seq_in_progress = false; 
                    }, 3500);
                  }
                }),
              ]
            )
          ]
        ),

        // footer
        View(
          {
            style: {
              backgroundColor: '#f8f9fa',
              padding: '15px 20px',
              textAlign: 'center',
              borderTop: '1px solid #e9ecef'
            }
          },
          [
            Text({
              style: {
                fontSize: '12px',
                color: '#6c757d'
              }
            }, "All interactions are logged and sent to the device")
          ]
        )
      ]
    );
  }
});